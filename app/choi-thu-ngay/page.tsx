"use client";

/**
 * ==============================================================================
 * FILE: app/choi-thu-ngay/page.tsx
 * MỤC ĐÍCH: Bàn chơi Ngũ Cung tương tác thời gian thực
 * TÍNH NĂNG:
 * - Chế độ 1: Đấu với Máy (Bot AI thông minh, không phạm luật)
 * - Chế độ 2: Chuyền máy (Pass & Play) cho 2 - 5 người chơi
 * - Thiết kế tối ưu cho bé 7+: nút bấm >= 44px, gợi ý tổ hợp trực quan, bảng hướng dẫn 4 bước
 * - Tương tác âm thanh WebAudio theo từng nốt ngũ cung khi đánh bài
 * ==============================================================================
 */

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  Bot,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Swords,
  Trophy,
  ArrowRight,
  ShieldAlert,
  Music,
  CheckCircle2,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  GameState,
  CardInstance,
  ComboResult,
  BreakSoundTarget,
  ElementType,
} from "@/lib/rules/types";
import {
  createGame,
  pickFromMarket,
  presentCombo,
  breakSound,
  findCombos,
  getBreakSoundOptions,
  getCurrentPlayer,
  HAND_LIMIT,
  WIN_THRESHOLD,
} from "@/lib/rules/engine";
import { decideBotMove, executeBotTurn } from "@/lib/rules/bot";
import { soundEngine } from "@/lib/audio";

const ELEMENT_LABELS: Record<ElementType, { name: string; note: string; color: string; bg: string; border: string }> = {
  tho: { name: "Thổ", note: "Cung (C4)", color: "text-[#B45309]", bg: "bg-[#F2B632]", border: "border-[#B45309]" },
  kim: { name: "Kim", note: "Thương (D4)", color: "text-[#475569]", bg: "bg-[#CBD5E1]", border: "border-[#475569]" },
  moc: { name: "Mộc", note: "Giốc (E4)", color: "text-[#15803D]", bg: "bg-[#3F7D3B]", border: "border-[#15803D]" },
  hoa: { name: "Hỏa", note: "Chủy (G4)", color: "text-[#B91C1C]", bg: "bg-[#D23A22]", border: "border-[#B91C1C]" },
  thuy: { name: "Thủy", note: "Vũ (A4)", color: "text-[#1D4ED8]", bg: "bg-[#1F3F7E]", border: "border-[#1D4ED8]" },
};

const COMBO_LABELS: Record<string, { label: string; desc: string; score: number }> = {
  "ngu-cung": { label: "Ngũ Cung Hòa Điệu", desc: "5 lá đủ 5 hành khác nhau", score: 8 },
  "hop-tau": { label: "Hợp Tấu", desc: "3 nhạc cụ khác nhau cùng họ", score: 4 },
  "dong-am": { label: "Đồng Âm", desc: "3 lá cùng họ (có trùng loại)", score: 2 },
  "lien-hoan": { label: "Liên Hoàn Tương Sinh", desc: "Cặp sinh (Mộc->Hỏa->Thổ->Kim->Thủy) + nhận 1 lá Chợ", score: 2 },
};

export default function ChoiThuNgayPage() {
  const [gameMode, setGameMode] = useState<"bot" | "pass">("bot");
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [passScreenLocked, setPassScreenLocked] = useState<boolean>(false);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Khởi tạo GameState
  const [game, setGame] = useState<GameState>(() =>
    createGame({
      playerCount: 1,
      botCount: 1,
      names: ["Bạn", "Máy Trí Tuệ"],
      seed: 42,
    })
  );

  // Khởi động lại ván chơi
  const handleRestart = (mode = gameMode, count = playerCount) => {
    let newGame: GameState;
    if (mode === "bot") {
      newGame = createGame({
        playerCount: 1,
        botCount: count - 1,
        names: ["Bạn", "Máy 1", "Máy 2", "Máy 3"].slice(0, count),
        seed: Math.floor(Math.random() * 100000),
      });
    } else {
      newGame = createGame({
        playerCount: count,
        botCount: 0,
        names: Array.from({ length: count }, (_, i) => `Người chơi ${i + 1}`),
        seed: Math.floor(Math.random() * 100000),
      });
    }
    setGame(newGame);
    setPassScreenLocked(false);
  };

  const handleToggleSound = () => {
    const next = soundEngine.toggleMute();
    setIsMuted(next);
  };

  const activePlayer = game.players[game.currentPlayerIndex]!;
  const currentCombos = findCombos(activePlayer.hand);
  const currentBreakOptions = getBreakSoundOptions(game);
  const canPickMarket = activePlayer.hand.length < HAND_LIMIT && game.market.length > 0;

  // Xử lý tự động khi đến lượt Bot
  useEffect(() => {
    if (game.over) return;
    const current = game.players[game.currentPlayerIndex];
    if (current && current.isBot && !isBotThinking) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        startTransition(() => {
          try {
            const nextGame = executeBotTurn(game);
            setGame(nextGame);
            // Phát âm thanh khi máy đánh
            if (!isMuted) {
              soundEngine.playElementTone("hoa");
            }
          } catch (e) {
            console.error("Lỗi lượt máy:", e);
          } finally {
            setIsBotThinking(false);
          }
        });
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [game, isBotThinking, isMuted]);

  // Hành động Người chơi: Nhặt lá từ Chợ Nhạc
  const handlePickMarket = (index: number) => {
    if (isBotThinking || game.over || activePlayer.isBot) return;
    try {
      const card = game.market[index];
      if (card && !isMuted) {
        soundEngine.playElementTone(card.element);
      }
      const nextGame = pickFromMarket(game, index);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Nước đi không hợp lệ");
    }
  };

  // Hành động Người chơi: Trình tấu tổ hợp
  const handlePresentCombo = (combo: ComboResult) => {
    if (isBotThinking || game.over || activePlayer.isBot) return;
    try {
      if (!isMuted && combo.cards[0]) {
        soundEngine.playElementTone(combo.cards[0].element);
      }
      const nextGame = presentCombo(game, combo, 0);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Nước đi không hợp lệ");
    }
  };

  // Hành động Người chơi: Phá âm đối thủ
  const handleBreakSound = (opt: BreakSoundTarget) => {
    if (isBotThinking || game.over || activePlayer.isBot) return;
    try {
      if (!isMuted) {
        soundEngine.playElementTone("kim");
      }
      const nextGame = breakSound(game, opt);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Nước đi không hợp lệ");
    }
  };

  // Kiểm tra màn hình chuyền máy cho lượt tiếp theo
  const checkPassScreen = (nextGame: GameState) => {
    if (gameMode === "pass" && !nextGame.over) {
      setPassScreenLocked(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] py-8 px-4 sm:px-6 select-none font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER ĐIỀU KHIỂN CHÍNH */}
        <header className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] p-4 sm:p-6 rounded-2xl shadow-[6px_6px_0px_#1A1A1A] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#D23A22] text-white text-xs font-bold uppercase tracking-widest rounded-full border-2 border-[#1A1A1A]">
                Bàn Chơi 7+
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1A1A1A]">
                Sân Đấu Ngũ Cung
              </h1>
            </div>
            <p className="text-sm text-stone-600 font-medium">
              Thu thập 5 hành • Trình tấu tổ hợp âm vang • Chạm mốc 15 điểm để chiến thắng
            </p>
          </div>

          {/* CÁC NÚT ĐIỀU KHIỂN NHANH */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Chế độ chơi */}
            <div className="flex rounded-xl border-[2px] border-[#1A1A1A] bg-stone-100 p-1">
              <button
                onClick={() => {
                  setGameMode("bot");
                  handleRestart("bot", playerCount);
                }}
                className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[44px] ${
                  gameMode === "bot"
                    ? "bg-[#1A1A1A] text-white shadow-sm"
                    : "text-stone-700 hover:text-black"
                }`}
              >
                <Bot className="w-4 h-4" />
                Đấu với Máy
              </button>
              <button
                onClick={() => {
                  setGameMode("pass");
                  handleRestart("pass", playerCount);
                }}
                className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[44px] ${
                  gameMode === "pass"
                    ? "bg-[#1A1A1A] text-white shadow-sm"
                    : "text-stone-700 hover:text-black"
                }`}
              >
                <Users className="w-4 h-4" />
                Chuyền máy
              </button>
            </div>

            {/* Số người chơi */}
            <select
              value={playerCount}
              onChange={(e) => {
                const count = Number(e.target.value);
                setPlayerCount(count);
                handleRestart(gameMode, count);
              }}
              className="bg-white border-[2px] border-[#1A1A1A] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold min-h-[44px] shadow-[2px_2px_0px_#1A1A1A]"
            >
              <option value={2}>2 Người chơi</option>
              <option value={3}>3 Người chơi</option>
              <option value={4}>4 Người chơi</option>
              <option value={5}>5 Người chơi</option>
            </select>

            {/* Nút Âm thanh */}
            <button
              onClick={handleToggleSound}
              className="p-2 sm:px-3 sm:py-2 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-bold min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1A1A1A] hover:bg-stone-50"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-stone-500" /> : <Volume2 className="w-5 h-5 text-[#D23A22]" />}
            </button>

            {/* Nút Hướng dẫn */}
            <button
              onClick={() => setShowTutorial(true)}
              className="p-2 sm:px-3 sm:py-2 bg-[#F2B632] border-[2px] border-[#1A1A1A] rounded-xl font-bold min-h-[44px] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1A1A1A] hover:brightness-105"
            >
              <HelpCircle className="w-5 h-5 text-[#1A1A1A]" />
              <span className="hidden sm:inline text-xs font-black">Luật 7+</span>
            </button>

            {/* Nút Chơi lại */}
            <button
              onClick={() => handleRestart()}
              className="p-2 sm:px-3 sm:py-2 bg-white border-[2px] border-[#1A1A1A] rounded-xl font-bold min-h-[44px] min-w-[44px] flex items-center justify-center gap-1 shadow-[2px_2px_0px_#1A1A1A] hover:bg-stone-50"
              title="Chia ván mới"
            >
              <RotateCcw className="w-5 h-5 text-stone-700" />
            </button>
          </div>
        </header>

        {/* BẢNG ĐIỂM NGƯỜI CHƠI */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {game.players.map((p, idx) => {
            const isTurn = idx === game.currentPlayerIndex;
            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border-[3px] transition-all relative ${
                  isTurn
                    ? "bg-amber-100/90 border-[#D23A22] shadow-[4px_4px_0px_#D23A22] scale-[1.02]"
                    : "bg-white border-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] opacity-85"
                }`}
              >
                {isTurn && (
                  <span className="absolute -top-3 left-3 bg-[#D23A22] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-[#1A1A1A] animate-pulse">
                    Đang đánh
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm truncate">{p.name}</span>
                  {p.isBot && <Bot className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#D23A22]">{p.score} <span className="text-xs font-bold text-stone-500">/ 15đ</span></span>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300">
                    {p.hand.length} lá
                  </span>
                </div>
                {p.hopTauCount > 0 && (
                  <div className="mt-1 text-[11px] font-bold text-emerald-700">
                    ★ {p.hopTauCount} Hợp tấu
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* KHU VỰC TRUNG TÂM: CHỢ NHẠC & CỌC BÀI */}
        <section className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] p-5 sm:p-6 rounded-2xl shadow-[6px_6px_0px_#1A1A1A] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[#1A1A1A]">
                Chợ Nhạc Cụ (Chọn 1 lá về tay)
              </span>
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-300">
                5 lá sẵn sàng
              </span>
            </div>
            <div className="text-xs font-bold text-stone-600 flex items-center gap-3">
              <span>Cọc rút: <b>{game.deck.length}</b> lá</span>
              <span>Cọc bỏ: <b>{game.discard.length}</b> lá</span>
            </div>
          </div>

          {/* 5 LÁ BÀI TRÊN CHỢ */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {game.market.map((card, idx) => {
              const el = ELEMENT_LABELS[card.element];
              const isTurn = !activePlayer.isBot && !game.over;
              return (
                <div
                  key={card.instanceId}
                  onClick={() => isTurn && handlePickMarket(idx)}
                  className={`border-[3px] border-[#1A1A1A] rounded-xl p-3 flex flex-col justify-between h-40 sm:h-44 transition-all relative overflow-hidden group ${
                    isTurn && canPickMarket
                      ? "cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1A1A1A] bg-white"
                      : "opacity-90 bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-md text-white border border-[#1A1A1A] ${el.bg}`}>
                      {el.name}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500">{el.note}</span>
                  </div>

                  <div className="my-auto text-center space-y-1">
                    <Music className="w-7 h-7 mx-auto text-stone-700 opacity-60 group-hover:scale-110 transition-transform" />
                    <h3 className="font-black text-sm sm:text-base leading-tight text-[#1A1A1A]">
                      {card.name}
                    </h3>
                  </div>

                  {isTurn && canPickMarket ? (
                    <button
                      className="w-full py-1.5 bg-[#F2B632] border-2 border-[#1A1A1A] rounded-lg text-xs font-black shadow-[2px_2px_0px_#1A1A1A] group-hover:bg-amber-400 min-h-[34px]"
                    >
                      Nhặt lá này
                    </button>
                  ) : (
                    <div className="text-[10px] text-center text-stone-400 font-bold">
                      Chợ nhạc cụ
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* KHU VỰC TAY BÀI CỦA NGƯỜI CHƠI HIỆN TẠI */}
        <section className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] p-5 sm:p-6 rounded-2xl shadow-[6px_6px_0px_#1A1A1A] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-stone-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#1A1A1A]">
                  Tay bài: {activePlayer.name}
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 border border-stone-300">
                  {activePlayer.hand.length} / {HAND_LIMIT} lá tối đa
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium">
                Chọn 1 trong 3 hành động: Nhặt 1 lá Chợ • Trình tấu tổ hợp • Phá âm đối thủ
              </p>
            </div>

            {/* Trạng thái máy suy nghĩ */}
            {isBotThinking && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 border-2 border-amber-600 rounded-lg text-amber-900 font-bold text-xs animate-pulse">
                <Bot className="w-4 h-4" />
                {activePlayer.name} đang toan tính nước đi...
              </div>
            )}
          </div>

          {/* HIỂN THỊ CÁC LÁ TRÊN TAY */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {activePlayer.hand.map((card) => {
              const el = ELEMENT_LABELS[card.element];
              return (
                <div
                  key={card.instanceId}
                  className={`border-[2px] border-[#1A1A1A] rounded-xl p-2.5 bg-white shadow-[2px_2px_0px_#1A1A1A] flex flex-col justify-between h-32 relative`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded text-white ${el.bg}`}>
                      {el.name}
                    </span>
                    <span className="text-[9px] font-bold text-stone-400">{el.note.split(" ")[0]}</span>
                  </div>
                  <div className="text-center my-auto">
                    <p className="font-extrabold text-xs sm:text-sm leading-tight text-[#1A1A1A]">
                      {card.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* GỢI Ý TỔ HỢP TRÌNH TẤU (DÀNH CHO BÉ 7+ DỄ CHƠI) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D23A22]" />
              Tổ Hợp Hòa Thanh Khả Thi Trên Tay ({currentCombos.length})
            </h3>

            {currentCombos.length === 0 ? (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500 font-medium italic">
                Chưa đủ lá để ghép tổ hợp. Hãy nhặt thêm lá từ Chợ Nhạc để hoàn thiện Ngũ Cung, Hợp tấu hoặc Liên hoàn!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentCombos.map((combo, idx) => {
                  const meta = COMBO_LABELS[combo.kind] ?? { label: combo.kind, desc: "", score: combo.score };
                  return (
                    <div
                      key={idx}
                      className="border-[2px] border-[#1A1A1A] p-3 rounded-xl bg-amber-50/70 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-[#1A1A1A]">{meta.label}</span>
                          <span className="px-2 py-0.5 bg-[#D23A22] text-white text-xs font-black rounded border border-[#1A1A1A]">
                            +{combo.score} Điểm
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1">{meta.desc}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {combo.cards.map((c) => (
                            <span
                              key={c.instanceId}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${ELEMENT_LABELS[c.element].bg}`}
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        disabled={activePlayer.isBot || isBotThinking}
                        onClick={() => handlePresentCombo(combo)}
                        className="w-full py-2 bg-[#1A1A1A] hover:bg-stone-800 text-white font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#F2B632]" />
                        Trình tấu ngay (+{combo.score}đ)
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* HÀNH ĐỘNG PHÁ ÂM TƯƠNG KHẮC */}
          <div className="space-y-3 pt-2 border-t-2 border-stone-200">
            <h3 className="text-sm font-black text-[#1A1A1A] flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#1F3F7E]" />
              Hành Động Phá Âm ({currentBreakOptions.length} Cơ hội khắc chế)
            </h3>

            {currentBreakOptions.length === 0 ? (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500 font-medium italic">
                Hiện không có đối thủ nào cầm lá thuộc hành bị các lá trên tay bạn khắc chế.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentBreakOptions.slice(0, 6).map((opt, idx) => {
                  const targetOpponent = game.players.find((p) => p.id === opt.targetPlayerId);
                  const actingCard = activePlayer.hand.find((c) => c.instanceId === opt.actingCardInstanceId);
                  const targetCard = targetOpponent?.hand.find((c) => c.instanceId === opt.targetCardInstanceId);

                  if (!targetOpponent || !actingCard || !targetCard) return null;

                  return (
                    <div
                      key={idx}
                      className="border-[2px] border-[#1A1A1A] p-3 rounded-xl bg-blue-50/70 shadow-[3px_3px_0px_#1A1A1A] flex flex-col justify-between gap-2.5"
                    >
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-stone-700">
                          Mục tiêu: <span className="font-black text-[#D23A22]">{targetOpponent.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
                          <span>Dùng <b>{actingCard.name}</b> ({ELEMENT_LABELS[actingCard.element].name})</span>
                          <ArrowRight className="w-3 h-3 text-stone-400" />
                          <span>Ép bỏ <b>{targetCard.name}</b> ({ELEMENT_LABELS[targetCard.element].name})</span>
                        </div>
                      </div>

                      <button
                        disabled={activePlayer.isBot || isBotThinking}
                        onClick={() => handleBreakSound(opt)}
                        className="w-full py-2 bg-[#1F3F7E] hover:bg-blue-900 text-white font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Swords className="w-3.5 h-3.5" />
                        Phá âm mục tiêu này
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* NHẬT KÝ VÁN ĐẤU */}
        <section className="bg-[#FFFDF9] border-[3px] border-[#1A1A1A] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#1A1A1A] space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-500">
            Nhật ký diễn biến trận đấu
          </h3>
          <div className="h-28 overflow-y-auto space-y-1 text-xs font-medium text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
            {game.log.slice().reverse().map((entry, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <ChevronRight className="w-3 h-3 text-stone-400 mt-0.5 flex-shrink-0" />
                <span>{entry}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER ĐIỀU HƯỚNG */}
        <footer className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-stone-600 pt-2">
          <div className="flex items-center gap-4">
            <Link href="/luat-choi" className="hover:underline hover:text-black">
              Tra cứu luật đầy đủ
            </Link>
            <Link href="/ngu-hanh" className="hover:underline hover:text-black">
              Sơ đồ Tương sinh - Tương khắc
            </Link>
            <Link href="/choi-thu" className="hover:underline hover:text-black text-[#D23A22]">
              Đăng ký bộ bài thật 7+
            </Link>
          </div>
          <div>Bản quyền © 2026 Ngũ Cung Board Game</div>
        </footer>
      </div>

      {/* MÀN HÌNH KHÓA CHUYỀN MÁY (PASS & PLAY SHIELD) */}
      {passScreenLocked && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-[4px] border-[#1A1A1A] p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-[8px_8px_0px_#1A1A1A] text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#F2B632] border-[3px] border-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_#1A1A1A]">
              <Eye className="w-8 h-8 text-[#1A1A1A]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1A1A1A]">Chuyền máy!</h3>
              <p className="text-sm font-medium text-stone-600">
                Hãy chuyền thiết bị cho{" "}
                <span className="font-black text-[#D23A22] text-base">
                  {game.players[game.currentPlayerIndex]?.name}
                </span>{" "}
                để tiếp tục lượt chơi bí mật.
              </p>
            </div>

            <button
              onClick={() => setPassScreenLocked(false)}
              className="w-full py-3.5 bg-[#D23A22] hover:bg-red-700 text-white font-black text-sm rounded-xl border-[2px] border-[#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] min-h-[48px] transition-all"
            >
              Tôi đã sẵn sàng, mở bài!
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHIẾN THẮNG */}
      {game.over && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-[4px] border-[#1A1A1A] p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-[8px_8px_0px_#1A1A1A] text-center space-y-6">
            <div className="w-20 h-20 bg-[#F2B632] border-[3px] border-[#1A1A1A] rounded-3xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_#1A1A1A]">
              <Trophy className="w-10 h-10 text-[#D23A22]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-[#D23A22]">
                Khúc Khải Hoàn Âm Vang
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                {game.players.find((p) => p.id === game.winnerId)?.name} Chiến Thắng!
              </h3>
            </div>

            {/* BẢNG XẾP HẠNG CUỐI VÁN */}
            <div className="border-[2px] border-[#1A1A1A] rounded-xl overflow-hidden divide-y divide-stone-200">
              {game.players
                .slice()
                .sort((a, b) => (b.score !== a.score ? b.score - a.score : b.hopTauCount - a.hopTauCount))
                .map((p, idx) => (
                  <div key={p.id} className="p-3 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      {p.name}
                    </span>
                    <span className="text-sm font-black text-[#D23A22]">
                      {p.score} điểm ({p.hopTauCount} Hợp tấu)
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleRestart()}
                className="flex-1 py-3 bg-[#D23A22] text-white font-black text-sm rounded-xl border-[2px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] min-h-[44px]"
              >
                Chơi ván mới
              </button>
              <Link
                href="/choi-thu"
                className="flex-1 py-3 bg-[#F2B632] text-[#1A1A1A] font-black text-sm rounded-xl border-[2px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] flex items-center justify-center min-h-[44px]"
              >
                Đăng ký bản thật
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HƯỚNG DẪN NHANH DÀNH CHO BÉ 7+ */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border-[4px] border-[#1A1A1A] p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-[8px_8px_0px_#1A1A1A] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
              <h3 className="text-xl font-black text-[#1A1A1A] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#D23A22]" />
                Luật Chơi Dành Cho Bé 7+
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-stone-400 hover:text-black font-black text-xl p-1 min-h-[44px] min-w-[44px]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm font-medium text-stone-700">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F2B632] text-black font-black flex items-center justify-center text-xs flex-shrink-0">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-black">Mỗi lượt làm 1 trong 3 việc:</h4>
                  <p>Nhặt 1 lá từ Chợ Nhạc, hoặc Trình tấu tổ hợp ghi điểm, hoặc Phá âm đối thủ.</p>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#D23A22] text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-black">4 cách ghi điểm:</h4>
                  <ul className="list-disc pl-4 space-y-0.5 text-xs">
                    <li><b>Đồng âm (2đ):</b> 3 lá cùng họ.</li>
                    <li><b>Liên hoàn (2đ):</b> Cặp sinh theo chiều Mộc→Hỏa→Thổ→Kim→Thủy + tặng 1 lá Chợ!</li>
                    <li><b>Hợp tấu (4đ):</b> 3 nhạc cụ KHÁC NHAU cùng họ.</li>
                    <li><b>Ngũ Cung (8đ):</b> 5 lá đủ 5 họ khác nhau.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1F3F7E] text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-black">Phá âm (Khắc chế):</h4>
                  <p>Bỏ 1 lá hành mình để ép 1 đối thủ bỏ 1 lá hành bị khắc (ví dụ: Mộc khắc Thổ, Thổ khắc Thủy...).</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#3F7D3B] text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-black">Ai đạt 15 điểm trước sẽ thắng!</h4>
                  <p>Nếu hòa điểm, ai biểu diễn nhiều bộ Hợp tấu hơn sẽ là người chiến thắng.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTutorial(false)}
              className="w-full py-3 bg-[#1A1A1A] text-white font-black text-sm rounded-xl min-h-[44px]"
            >
              Đã hiểu, vào chơi ngay!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
