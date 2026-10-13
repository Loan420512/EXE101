/**
 * ==============================================================================
 * FILE: components/LivingBackground/DiepPaperShader.ts
 * MỤC ĐÍCH: Shader GLSL tự viết tái hiện chất liệu Giấy Điệp truyền thống Đông Hồ:
 * - Vân giấy fbm (Fractal Brownian Motion)
 * - Xơ sợi giấy tự nhiên
 * - Bột sò điệp lấp lánh (mẹ điệp - pearl shimmer)
 * - Họa tiết hoa văn Đông Hồ (trống đồng xoay chậm, mây cuộn, sóng nước)
 * - Chuyển sắc thái 5 hành theo section mượt mà (smooth lerp)
 * ==============================================================================
 */

export const VERTEX_SHADER = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uIsDark;
  uniform vec2 uPointer;
  uniform float uPointerRipple;
  uniform float uContrast;
  uniform float uDrumRotate;

  varying vec2 vUv;

  // 1. Simplex/FBM Noise hàm sinh vân giấy
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p = p * 2.02;
    f += 0.2500 * snoise(p); p = p * 2.03;
    f += 0.1250 * snoise(p); p = p * 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  // 2. Hoa văn trống đồng Đông Hồ (tâm màn hình xoay cực chậm)
  float drumPattern(vec2 uv, float angle) {
    vec2 p = uv - vec2(0.5);
    p.x *= uResolution.x / uResolution.y;
    float dist = length(p);
    
    // Xoay góc
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec2 rotP = vec2(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);
    float a = atan(rotP.y, rotP.x);

    // Vòng tròn đồng tâm
    float rings = abs(sin(dist * 45.0));
    rings = smoothstep(0.85, 0.98, rings);

    // Tia sao mặt trời 14 cánh ở tâm
    float sunRays = cos(a * 14.0);
    float sunMask = smoothstep(0.18, 0.05, dist) * smoothstep(0.3, 0.9, sunRays);

    // Chim lạc bay vòng ngoài
    float birds = cos(a * 8.0 + dist * 10.0);
    float birdMask = smoothstep(0.2, 0.28, dist) * smoothstep(0.38, 0.28, dist) * smoothstep(0.4, 0.8, birds);

    return (rings * 0.15 + sunMask * 0.35 + birdMask * 0.25);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspectUv = uv;
    aspectUv.x *= uResolution.x / uResolution.y;

    // A. Vân giấy điệp fbm
    float paperNoise = fbm(aspectUv * 8.0);
    float fineFibers = fbm(aspectUv * 36.0);
    float paperGrain = paperNoise * 0.08 + fineFibers * 0.03;

    // B. Vảy điệp lấp lánh (Scintillating Pearl Shimmer)
    // Tinh thể vỏ điệp nghiền mịn phản chiếu ánh sáng khi đổi góc nhìn
    vec2 sparkleCoord = aspectUv * 70.0;
    float spark = snoise(sparkleCoord + vec2(uTime * 0.03));
    spark = pow(max(0.0, spark), 9.0) * 0.85;

    // C. Họa tiết trống đồng ẩn hiện tinh tế
    float drum = drumPattern(uv, uDrumRotate) * uContrast;

    // D. Vệt sóng nước / mây cuộn Đông Hồ
    float cloud = sin(aspectUv.x * 3.0 + uTime * 0.04 + snoise(aspectUv * 2.0)) * 
                  cos(aspectUv.y * 3.0 - uTime * 0.03);
    cloud = smoothstep(0.65, 0.95, cloud) * 0.06;

    // E. Vệt gợn mực loang theo con trỏ
    float pDist = length((uv - uPointer) * vec2(uResolution.x / uResolution.y, 1.0));
    float pointerWave = sin(pDist * 30.0 - uPointerRipple * 8.0) * exp(-pDist * 5.0) * uPointerRipple;

    // F. Pha trộn màu theo chế độ Sáng / Tối
    vec3 baseColor;
    if (uIsDark > 0.5) {
      // Đêm trống đồng: Chàm sâu (#0B1026) điểm xuyết vàng kim & sao li ti
      vec3 nightBg = vec3(0.043, 0.063, 0.149); // #0B1026
      vec3 drumSunGlow = vec3(0.95, 0.71, 0.20); // #F2B632
      baseColor = mix(nightBg, drumSunGlow, drum * 0.45);
      baseColor += spark * vec3(0.8, 0.9, 1.0); // Sao & vảy điệp ánh bạc
      baseColor += cloud * vec3(0.15, 0.25, 0.45);
      baseColor += pointerWave * 0.08 * uColorA;
    } else {
      // Ngày truyền thống: Nền giấy điệp xám xanh nhạt (#E8EAE0)
      vec3 diepBase = vec3(0.91, 0.918, 0.878); // #E8EAE0
      // Hòa sắc tinh tế với màu hành đại diện section
      vec3 tint = mix(uColorA, uColorB, uv.y);
      baseColor = mix(diepBase, tint, 0.07);
      baseColor += paperGrain;
      baseColor += spark * vec3(1.0, 0.98, 0.92) * 0.35; // Lấp lánh vảy sò
      baseColor -= drum * 0.12; // Mực đen khắc gỗ mờ
      baseColor += cloud * 0.04;
      baseColor += pointerWave * 0.06 * uColorC;
    }

    // G. Viền tối nhẹ (Vignette) mộc mạc kiểu tranh khắc bản
    float vignette = length((uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0));
    vignette = smoothstep(1.3, 0.35, vignette);
    baseColor *= (0.88 + 0.12 * vignette);

    gl_FragColor = vec4(baseColor, 1.0);
  }
`;
