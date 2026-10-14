"use client";

/**
 * ==============================================================================
 * FILE: components/LivingBackground/LivingBackground.tsx
 * MỤC ĐÍCH: Nền sống WebGL ngũ hành "Đông Hồ":
 * - Layer 0: Shader giấy điệp fbm, vảy điệp lấp lánh, trống đồng xoay chậm.
 * - Layer 1: Hạt GPU / Canvas instanced theo hành (Thủy, Hỏa, Mộc, Kim, Thổ).
 * - Layer 2: Tương tác vệt mực gợn sóng và lực hút hạt theo chuột/chạm.
 * - Tự động đổi bầu không khí theo section khi cuộn trang.
 * - Phân hạng thiết bị 4 cấp: High (đầy đủ), Mid (giảm hạt), Low (Canvas 2D), Min (CSS tĩnh).
 * - Tối ưu LCP Lighthouse: Khởi động WebGL trễ sau khi nội dung tĩnh đã hiện.
 * - Nút "Tạm dừng nền" cho người dùng chủ động kiểm soát.
 * ==============================================================================
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { readBrowserHints, detectDeviceTier, DeviceTier } from "@/lib/device/tier";
import { ATMOSPHERE_COLORS, SCENE_TRANSITION_CONFIG } from "@/config/effects";
import { SECTION_ATMOSPHERE, SectionId } from "@/config/sections";
import { SCENES, DRUM_ASSET, type SceneKey, getSceneByElement } from "@/data/scenes";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./DiepPaperShader";
import { ElementalParticleSystem } from "./ParticleSystem";
import CssFallbackBackground from "./CssFallbackBackground";

const SECTION_SCENE_MAP: Record<SectionId, SceneKey> = {
  hero: "default",
  "cau-chuyen": "tho",
  "choi-30s": "moc",
  "bo-bai": "thuy",
  "ngu-hanh": "tho",
  "luat-choi": "kim",
  "dang-ky": "hoa",
  "doi-ngu": "thuy",
};

interface LivingBackgroundProps {
  currentSection?: SectionId;
  forceAtmosphere?: keyof typeof ATMOSPHERE_COLORS;
  activeScene?: SceneKey;
}

export default function LivingBackground({
  currentSection = "hero",
  forceAtmosphere,
  activeScene,
}: LivingBackgroundProps) {
  const [deviceTier, setDeviceTier] = useState<DeviceTier>(() => detectDeviceTier(readBrowserHints()));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(() => detectDeviceTier(readBrowserHints()) === "min");
  const [overrideScene, setOverrideScene] = useState<SceneKey | null>(null);

  // Lắng nghe sự kiện chuyển cảnh toàn cục (ngucung:set-scene)
  useEffect(() => {
    const handleSceneEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ element?: SceneKey; duration?: number }>;
      if (customEvent.detail?.element && customEvent.detail.element in SCENES) {
        setOverrideScene(customEvent.detail.element);
        if (customEvent.detail.duration) {
          const timeoutId = setTimeout(() => {
            setOverrideScene((cur) => (cur === customEvent.detail?.element ? null : cur));
          }, customEvent.detail.duration);
          return () => clearTimeout(timeoutId);
        }
      }
    };

    window.addEventListener("ngucung:set-scene", handleSceneEvent);
    return () => {
      window.removeEventListener("ngucung:set-scene", handleSceneEvent);
    };
  }, []);

  const activeSceneKey: SceneKey = (
    overrideScene ||
    activeScene ||
    (forceAtmosphere && forceAtmosphere in SCENES ? (forceAtmosphere as SceneKey) : null) ||
    (currentSection ? SECTION_SCENE_MAP[currentSection] : "default") ||
    "default"
  );
  const activeSceneData = getSceneByElement(activeSceneKey);


  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const animationFrameRef = useRef<number | null>(null);
  const particleSystemRef = useRef<ElementalParticleSystem | null>(null);

  // Trạng thái tương tác chuột
  const pointerRef = useRef<{ x: number; y: number; ripple: number }>({
    x: 0.5,
    y: 0.5,
    ripple: 0,
  });

  // Giám sát FPS Guardian để tự hạ cấp nếu giật (>20ms trong 1s)
  const jankStatsRef = useRef<{ jankDurationMs: number; lastTime: number }>({
    jankDurationMs: 0,
    lastTime: 0,
  });

  // 1. Trì hoãn tải WebGL để tối ưu điểm LCP
  useEffect(() => {
    if (deviceTier === "min") return;

    // Trì hoãn khởi động WebGL sau khi render trang chính xong (idle callback)
    const onIdle = () => setIsReady(true);
    if ("requestIdleCallback" in window) {
      const handle = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(onIdle, { timeout: 1200 });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(onIdle, 600);
      return () => clearTimeout(timer);
    }
  }, [deviceTier]);

  // 2. Khởi tạo WebGL & vòng lặp diễn hoạt
  useEffect(() => {
    if (!isReady || deviceTier === "min" || isPaused) return;

    const canvas = canvasRef.current;
    const pCanvas = particleCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      setDeviceTier("min");
      return;
    }

    // Thiết lập WebGL Shaders
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, source);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.warn("Shader error:", glCtx.getShaderInfoLog(s));
        glCtx.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Dựng 1 quad hình chữ nhật phủ toàn màn hình
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Lấy Uniform locations
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uColALoc = gl.getUniformLocation(program, "uColorA");
    const uColBLoc = gl.getUniformLocation(program, "uColorB");
    const uColCLoc = gl.getUniformLocation(program, "uColorC");
    const uIsDarkLoc = gl.getUniformLocation(program, "uIsDark");
    const uPointerLoc = gl.getUniformLocation(program, "uPointer");
    const uRippleLoc = gl.getUniformLocation(program, "uPointerRipple");
    const uContrastLoc = gl.getUniformLocation(program, "uContrast");
    const uDrumRotateLoc = gl.getUniformLocation(program, "uDrumRotate");

    // Khởi tạo Canvas hạt 2D
    const pCtx = pCanvas ? pCanvas.getContext("2d") : null;
    const particleCount = deviceTier === "high" ? 180 : 70;
    const pSystem = new ElementalParticleSystem(particleCount);
    particleSystemRef.current = pSystem;

    // Resize Canvas phù hợp độ phân giải và DPR
    function handleResize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, deviceTier === "high" ? 1.5 : 1.0);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl?.viewport(0, 0, canvas.width, canvas.height);

      if (pCanvas && pCtx) {
        pCanvas.width = w;
        pCanvas.height = h;
        pCanvas.style.width = `${w}px`;
        pCanvas.style.height = `${h}px`;
        pSystem.setSize(w, h);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    // Chuyển màu hex sang rgb [0..1]
    function hexToRgbNorm(hex: string): [number, number, number] {
      const cleaned = hex.replace("#", "");
      const num = parseInt(cleaned, 16);
      return [(num >> 16) / 255, ((num >> 8) & 0xff) / 255, (num & 0xff) / 255];
    }

    // Vòng lặp render chính
    const startTime = performance.now();
    let drumAngle = 0;

    const renderLoop = (now: number) => {
      // Chỉ vẽ khi tab đang hiển thị
      if (document.hidden) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Giám sát FPS Guardian
      const delta = now - jankStatsRef.current.lastTime;
      jankStatsRef.current.lastTime = now;
      if (delta > 20) {
        jankStatsRef.current.jankDurationMs += delta;
        if (jankStatsRef.current.jankDurationMs > 1000 && deviceTier === "high") {
          setDeviceTier("mid");
          jankStatsRef.current.jankDurationMs = 0;
        }
      } else {
        jankStatsRef.current.jankDurationMs = Math.max(0, jankStatsRef.current.jankDurationMs - 10);
      }

      const elapsed = (now - startTime) * 0.001;
      drumAngle += 0.0003; // Trống đồng xoay cực chậm

      // Giảm dần độ gợn chuột
      pointerRef.current.ripple = Math.max(0, pointerRef.current.ripple - 0.015);

      // Xác định bầu không khí hiện tại
      const atmoKey = forceAtmosphere || SECTION_ATMOSPHERE[currentSection] || "mix";
      const atmo = ATMOSPHERE_COLORS[atmoKey] || ATMOSPHERE_COLORS.mix;
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const rgbA = hexToRgbNorm(atmo.a);
      const rgbB = hexToRgbNorm(atmo.b);
      const rgbC = hexToRgbNorm(atmo.c);

      // Gửi uniforms cho WebGL
      gl.useProgram(program);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform3f(uColALoc, rgbA[0], rgbA[1], rgbA[2]);
      gl.uniform3f(uColBLoc, rgbB[0], rgbB[1], rgbB[2]);
      gl.uniform3f(uColCLoc, rgbC[0], rgbC[1], rgbC[2]);
      gl.uniform1f(uIsDarkLoc, isDark ? 1.0 : 0.0);
      gl.uniform2f(uPointerLoc, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(uRippleLoc, pointerRef.current.ripple);
      gl.uniform1f(uContrastLoc, isDark ? 0.25 : 0.08);
      gl.uniform1f(uDrumRotateLoc, drumAngle);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Cập nhật và vẽ hạt ngũ hành nếu có canvas 2D
      if (pCanvas && pCtx) {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        const pixelPointerX = pointerRef.current.x * pCanvas.width;
        const pixelPointerY = (1.0 - pointerRef.current.y) * pCanvas.height;
        pSystem.setAtmosphere(atmo.particle);
        pSystem.update(pixelPointerX, pixelPointerY, true);
        pSystem.draw(pCtx);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    // Lắng nghe tương tác chuột / chạm
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

      pointerRef.current.x = clientX / window.innerWidth;
      pointerRef.current.y = 1.0 - clientY / window.innerHeight; // Đảo trục Y cho WebGL
      pointerRef.current.ripple = Math.min(1.0, pointerRef.current.ripple + 0.15);
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReady, deviceTier, isPaused, currentSection, forceAtmosphere]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  if (deviceTier === "min") {
    return <CssFallbackBackground currentScene={activeSceneKey} />;
  }

  return (
    <>
      {/* 1. Lớp ảnh quang cảnh thực (6 cảnh: Mặc định + 5 Hành) */}
      <div
        className="fixed inset-0 pointer-events-none z-[-4] overflow-hidden select-none bg-[#16141A]"
        aria-hidden="true"
      >
        {Object.entries(SCENES).map(([key, sc]) => {
          const isActive = key === activeSceneKey;
          return (
            <picture
              key={key}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-35" : "opacity-0"
              }`}
            >
              <source type="image/avif" srcSet={sc.srcSetAvif} sizes="100vw" />
              <source type="image/webp" srcSet={sc.srcSetWebp} sizes="100vw" />
              <img
                src={sc.webpUrl}
                alt={sc.alt}
                className="w-full h-full object-cover object-center filter saturate-[0.85] contrast-[1.05]"
                loading={key === "default" ? "eager" : "lazy"}
                decoding="async"
              />
            </picture>
          );
        })}
      </div>

      {/* 2. Lớp phủ gradient chuyển cảnh & bảo toàn độ tương phản WCAG */}
      <div
        className="fixed inset-0 pointer-events-none z-[-3] transition-all duration-1000 ease-in-out"
        style={{
          background: activeSceneData.overlayGradient,
        }}
        aria-hidden="true"
      />

      {/* 3. Lớp Trống Đồng Đông Sơn thực xoay chậm lệch góc trên bên phải */}
      <div
        className="fixed -top-28 md:-top-44 -right-28 md:-right-44 pointer-events-none z-[-2] overflow-hidden w-[550px] h-[550px] md:w-[850px] md:h-[850px] transition-opacity duration-1000"
        style={{
          opacity: SCENE_TRANSITION_CONFIG.drum.opacity,
        }}
        aria-hidden="true"
      >
        <picture
          className="block w-full h-full animate-drum-spin"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          <source type="image/avif" srcSet={DRUM_ASSET.srcSetWebp.replace(/\.webp/g, ".avif")} sizes="850px" />
          <source type="image/webp" srcSet={DRUM_ASSET.srcSetWebp} sizes="850px" />
          <img
            src={DRUM_ASSET.webpUrl}
            alt={DRUM_ASSET.alt}
            className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(242,182,50,0.25)]"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      {/* 4. Canvas WebGL nền giấy điệp & họa tiết Đông Hồ */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[-2] w-full h-full opacity-60 mix-blend-overlay dark:opacity-50 dark:mix-blend-screen"
        aria-hidden="true"
      />

      {/* 5. Canvas hạt ngũ hành GPU/2D nổi nhẹ phía trên giấy điệp */}
      <canvas
        ref={particleCanvasRef}
        className="fixed inset-0 pointer-events-none z-[-1] w-full h-full"
        aria-hidden="true"
      />

      {/* 6. Nút tiện ích Tạm dừng nền cố định góc dưới bên phải màn hình */}
      <div className="fixed bottom-3 right-3 z-40">
        <button
          onClick={togglePause}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-[3px] bg-white/90 dark:bg-stone-900/90 text-[#16141A] dark:text-[#E8EAE0] border-[1.5px] border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] hover:bg-stone-100 transition-all cursor-pointer backdrop-blur-sm"
          title={isPaused ? "Tiếp tục chuyển động nền sống" : "Tạm dừng chuyển động nền"}
          aria-label={isPaused ? "Tiếp tục chuyển động nền sống" : "Tạm dừng chuyển động nền"}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D3B] dark:bg-[#F2B632] animate-pulse" />
          <span>{isPaused ? "▶ Tiếp tục nền" : "⏸ Tạm dừng nền"}</span>
        </button>
      </div>
    </>
  );
}
