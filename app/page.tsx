"use client";

/**
 * ==============================================================================
 * FILE: app/page.tsx
 * MỤC ĐÍCH: Trang chủ hoàn chỉnh bản xem trước web game "Ngũ Cung".
 * CẤU TRÚC:
 * 1. Header (Thanh demo draft + Điều hướng + Bật/Tắt âm thanh)
 * 2. Hero (Tiêu đề + Quạt 5 lá bài ngũ hành tương tác hiệu ứng biến ảo)
 * 3. Câu chuyện ("Văn hóa vẫn còn đó. Chỉ thiếu một cách để chạm vào." + Bảng so sánh 4 dòng)
 * 4. Chơi trong 30 giây (Minh họa bàn cờ 4 bước tự chuyển)
 * 5. Bộ bài (Lưới 15 nhạc cụ + Lọc 5 họ + Modal chi tiết + Nghe thử âm)
 * 6. Ngũ âm, ngũ hành (Sơ đồ ngũ giác tương tác SVG + Tương sinh / Tương khắc)
 * 7. Luật chơi rút gọn (Chuẩn bị + 3 hành động + Bảng điểm + Điều kiện thắng)
 * 8. Đăng ký chơi thử (Form mô phỏng + Lưu ý dưới 18 tuổi)
 * 9. Đội ngũ Team 35 + Giảng viên + 5 câu hỏi FAQ + Chân trang
 * 10. Canvas hiệu ứng toàn màn hình (Thủy, Hỏa, Mộc, Kim, Thổ)
 * ==============================================================================
 */

import React, { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import GameGuide30s from "@/components/GameGuide30s";
import CardDeck from "@/components/CardDeck";
import WuXingDiagram from "@/components/WuXingDiagram";
import RulesSection from "@/components/RulesSection";
import RegisterForm from "@/components/RegisterForm";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import ColorRibbon from "@/components/ColorRibbon";
import EffectCanvas from "@/components/EffectCanvas";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import PackOpeningModal from "@/components/PackOpening/PackOpeningModal";
import CollectionModal from "@/components/Collection/CollectionModal";
import { ElementType } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";
import { SectionId, SECTION_IDS } from "@/config/sections";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<SectionId>("hero");
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  const [activeEffect, setActiveEffect] = useState<{
    element: ElementType;
    cardRect: EffectTargetRect;
    onFinish: () => void;
  } | null>(null);

  // Theo dõi section đang cuộn qua để đổi bầu không khí nền sống
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const id = entry.target.id as SectionId;
            if (SECTION_IDS.includes(id)) {
              setCurrentSection(id);
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Kích hoạt hiệu ứng canvas khi bấm bất kỳ lá bài nào
  const handleTriggerEffect = useCallback(
    (
      element: ElementType,
      cardRect: EffectTargetRect,
      onFinish: () => void
    ) => {
      // Khóa không cho bấm chồng khi hiệu ứng đang chạy
      if (activeEffect) return;

      setActiveEffect({
        element,
        cardRect,
        onFinish,
      });
    },
    [activeEffect]
  );

  // Khi canvas chạy hết thời gian (~0.8s)
  const handleEffectComplete = useCallback(() => {
    if (activeEffect) {
      activeEffect.onFinish();
      setActiveEffect(null);
    }
  }, [activeEffect]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      {/* 0. NỀN SỐNG WEBGL NGŨ HÀNH & GIẤY ĐIỆP */}
      <LivingBackground currentSection={currentSection} />

      {/* 1. THANH TRÊN CÙNG & HEADER */}
      <Header
        onOpenPack={() => setIsPackModalOpen(true)}
        onOpenCollection={() => setIsCollectionModalOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {/* 2. HERO: TIÊU ĐỀ & QUẠT 5 LÁ BÀI */}
        <Hero
          onTriggerEffect={handleTriggerEffect}
          isEffectRunning={!!activeEffect}
        />

        <ColorRibbon />

        {/* 3. CÂU CHUYỆN SẢN PHẨM & BẢNG SO SÁNH 4 DÒNG */}
        <Story />

        <ColorRibbon />

        {/* 4. CHƠI TRONG 30 GIÂY */}
        <GameGuide30s />

        <ColorRibbon />

        {/* 5. BỘ BÀI 15 NHẠC CỤ & MODAL CHI TIẾT */}
        <CardDeck
          onTriggerEffect={handleTriggerEffect}
          isEffectRunning={!!activeEffect}
        />

        <ColorRibbon />

        {/* 6. NGŨ ÂM & NGŨ HÀNH (SƠ ĐỒ TƯƠNG TÁC) */}
        <WuXingDiagram />

        <ColorRibbon />

        {/* 7. LUẬT CHƠI RÚT GỌN */}
        <RulesSection />

        <ColorRibbon />

        {/* 8. ĐĂNG KÝ CHƠI THỬ (MÔ PHỎNG) */}
        <RegisterForm />

        <ColorRibbon />

        {/* 9. ĐỘI NGŨ TEAM 35, FAQ & FOOTER */}
        <TeamFaqFooter />
      </main>

      {/* 10. HIỆU ỨNG BIẾN ẢO CANVAS PHỦ TOÀN MÀN HÌNH (~0.8S) */}
      <EffectCanvas
        activeEffect={activeEffect}
        onComplete={handleEffectComplete}
      />

      {/* 11. MODAL MỞ GÓI BÀI 5 LÁ NGẪU NHIÊN */}
      <PackOpeningModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        onCardsUnlocked={() => {}}
      />

      {/* 12. MODAL BỘ SƯU TẬP 15 NHẠC CỤ & HUY HIỆU */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onOpenPackClick={() => {
          setIsCollectionModalOpen(false);
          setIsPackModalOpen(true);
        }}
      />
    </div>
  );
}
