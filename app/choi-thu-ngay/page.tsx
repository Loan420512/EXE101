"use client";

/**
 * ==============================================================================
 * FILE: app/choi-thu-ngay/page.tsx
 * MỤC ĐÍCH: (U6) Bàn chơi Ngũ Cung dựng như bàn thật — Chợ Nhạc ở giữa bàn, cọc
 * rút và cọc bỏ hai bên, bài trên tay xòe hình cánh quạt, nước đi hợp lệ được
 * làm sáng, ba nước (Chọn nhạc cụ / Trình tấu / Phá âm) có hoạt ảnh riêng.
 * KHÔNG SỬA LUẬT: mọi diễn biến đi qua lib/rules/engine.ts.
 * Chế độ: Đấu máy • Chuyền máy • Phòng trực tuyến (Bản thử — cần máy chủ cổng 4000).
 * ==============================================================================
 */

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import type {
  GameState,
  CardInstance,
  ComboResult,
  BreakSoundTarget,
} from "@/lib/rules/types";
import {
  createGame,
  pickFromMarket,
  presentCombo,
  breakSound,
  findCombos,
  getBreakSoundOptions,
  HAND_LIMIT,
  WIN_THRESHOLD,
} from "@/lib/rules/engine";
import { executeBotTurn } from "@/lib/rules/bot";
import { COMBO_LABELS } from "@/lib/rules/labels";
import { ELEMENT_CONFIG } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";
import HandFan from "@/components/board/HandFan";
import TableFelt from "@/components/board/TableFelt";
import ActionFlash, { type BoardFlash } from "@/components/board/ActionFlash";
import GameSummary from "@/components/board/GameSummary";
import {
  IconWarning, IconClose, IconUsers, IconGamepad, IconQuestion,
  IconVolume, IconVolumeMute, IconCycle, IconSparkles, IconSwords,
  IconArrowRight, IconCheck, IconChevronLeft, IconChevronRight,
  IconSearch, IconLink, IconMusicNote, IconHand,
} from "@/components/icons";

type Mode = "bot" | "pass" | "online";

/** Hạt giống ván mới — nằm ngoài component để giữ phần render thuần nhất. */
function randomSeed(): number {
  return Math.floor(Math.random() * 100000);
}

/** Đọc ?mode= & ?seed= từ URL (chỉ dùng trên máy khách). */
function readBoardParams(): { mode: Mode | null; seed: number | null } {
  if (typeof window === "undefined") return { mode: null, seed: null };
  const q = new URLSearchParams(window.location.search);
  const rawMode = q.get("mode");
  const rawSeed = q.get("seed");
  const mode: Mode | null =
    rawMode === "pass" ? "pass" : rawMode === "online" ? "online" : rawMode === "bot" ? "bot" : null;
  const seed = rawSeed && /^\d{4,12}$/.test(rawSeed) ? Number(rawSeed.slice(-6)) : null;
  return { mode, seed };
}

export default function ChoiThuNgayPage() {
  const [gameMode, setGameMode] = useState<Mode>("bot");
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [passScreenLocked, setPassScreenLocked] = useState<boolean>(false);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [flash, setFlash] = useState<BoardFlash | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  /** Lá đang bấm trên tay → lọc nước đi có dùng lá này (chơi một ngón cái). */
  const [pickedCardId, setPickedCardId] = useState<string | null>(null);
  const flashTimer = useRef<number | null>(null);

  // Trạng thái phòng trực tuyến (WebSocket)
  const [onlineRoomCode, setOnlineRoomCode] = useState<string>("");
  const [onlinePlayerName, setOnlinePlayerName] = useState<string>("");
  const [onlineMyPlayerId, setOnlineMyPlayerId] = useState<string | null>(null);
  const [onlineIsHost, setOnlineIsHost] = useState<boolean>(false);
  const [onlineRoomPlayers, setOnlineRoomPlayers] = useState<{ id: string; name: string; isHost: boolean }[]>([]);
  const [onlineStatus, setOnlineStatus] = useState<"disconnected" | "in_lobby" | "playing">("disconnected");
  const [onlineInputCode, setOnlineInputCode] = useState<string>("");
  const [onlineCopied, setOnlineCopied] = useState<boolean>(false);
  const [onlineError, setOnlineError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [, startTransition] = useTransition();

  const [game, setGame] = useState<GameState>(() =>
    createGame({ playerCount: 1, botCount: 1, names: ["Bạn", "Máy 1"], seed: 42 })
  );

  const handleRestart = (mode: Mode = gameMode, count: number = playerCount) => {
    if (mode === "online") {
      setGameMode("online");
      return;
    }
    const newGame =
      mode === "bot"
        ? createGame({
            playerCount: 1,
            botCount: Math.max(1, count - 1),
            names: ["Bạn", "Máy 1", "Máy 2", "Máy 3", "Máy 4"].slice(0, count),
            seed: randomSeed(),
          })
        : createGame({
            playerCount: count,
            botCount: 0,
            names: Array.from({ length: count }, (_, i) => `Người chơi ${i + 1}`),
            seed: randomSeed(),
          });
    setGame(newGame);
    setPassScreenLocked(false);
    setRulesError(null);
    setPickedCardId(null);
    setFlash(null);
  };

  const handleToggleSound = () => setIsMuted(soundEngine.toggleMute());

  /** Nhãn hoạt ảnh cho nước vừa đi — tự tắt sau 0.9 giây. */
  const triggerFlash = (f: BoardFlash) => {
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    setFlash(f);
    flashTimer.current = window.setTimeout(() => setFlash(null), 900);
  };
  useEffect(() => () => {
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
  }, []);

  const activePlayer = game.players[game.currentPlayerIndex] ?? game.players[0]!;
  /** Máy tới lượt: trạng thái suy ra từ GameState, không cần state riêng. */
  const botTurn = gameMode !== "online" && !game.over && activePlayer.isBot;
  const myTurn = gameMode === "online" ? !game.over : !activePlayer.isBot && !game.over;
  const currentCombos = findCombos(activePlayer.hand);
  const currentBreakOptions = getBreakSoundOptions(game);
  const canPickMarket = myTurn && activePlayer.hand.length < HAND_LIMIT && game.market.length > 0;

  const legalHandIds = Array.from(
    new Set([
      ...currentCombos.flatMap((c) => c.cards.map((x) => x.instanceId)),
      ...currentBreakOptions.map((o) => o.actingCardInstanceId),
    ])
  );
  const visibleCombos = pickedCardId
    ? currentCombos.filter((c) => c.cards.some((x) => x.instanceId === pickedCardId))
    : currentCombos;
  const visibleBreaks = pickedCardId
    ? currentBreakOptions.filter((o) => o.actingCardInstanceId === pickedCardId)
    : currentBreakOptions;

  /* ── Phòng trực tuyến (cần máy chủ ws cổng 4000) ─────────────────────────── */
  const connectOnlineRoom = (action: "create" | "join", code?: string) => {
    setOnlineError(null);
    try {
      const host = typeof window !== "undefined" ? window.location.hostname || "localhost" : "localhost";
      const ws = new WebSocket(`ws://${host}:4000`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (action === "create") {
          ws.send(JSON.stringify({ type: "CREATE_ROOM", name: onlinePlayerName || "Chủ phòng" }));
        } else {
          ws.send(
            JSON.stringify({
              type: "JOIN_ROOM",
              roomCode: (code || onlineInputCode).trim().toUpperCase(),
              name: onlinePlayerName || "Khách mời",
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "ROOM_CREATED") {
            setOnlineRoomCode(msg.roomCode);
            setOnlineMyPlayerId(msg.playerId);
            setOnlineIsHost(true);
            setOnlineStatus("in_lobby");
            setOnlineRoomPlayers(msg.players || []);
          } else if (msg.type === "ROOM_JOINED") {
            setOnlineRoomCode(msg.roomCode);
            setOnlineMyPlayerId(msg.playerId);
            setOnlineIsHost(false);
            setOnlineStatus("in_lobby");
          } else if (msg.type === "ROOM_PLAYERS_UPDATE") {
            setOnlineRoomPlayers(msg.players || []);
          } else if (msg.type === "GAME_STATE_UPDATE") {
            setGame(msg.game);
            setOnlineStatus("playing");
          } else if (msg.type === "ERROR") {
            setOnlineError(msg.message);
          }
        } catch (e) {
          console.error("WS Parse Error:", e);
        }
      };

      ws.onerror = () => {
        setOnlineError("Chưa nối được máy chủ phòng chơi (ws://localhost:4000). Hãy chạy server phòng rồi thử lại.");
      };
    } catch {
      setOnlineError("Lỗi kết nối WebSocket.");
    }
  };

  const startOnlineGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "START_GAME" }));
    }
  };

  /* ── Lượt máy: gọi lõi bot có sẵn, không đụng luật ───────────────────────── */
  useEffect(() => {
    if (game.over || gameMode === "online") return;
    const current = game.players[game.currentPlayerIndex];
    if (!current?.isBot) return;

    const timer = window.setTimeout(() => {
      startTransition(() => {
        try {
          const nextGame = executeBotTurn(game);
          setGame(nextGame);
          if (!isMuted) soundEngine.playElementTone("hoa");
          const next = nextGame.players[nextGame.currentPlayerIndex];
          triggerFlash({
            kind: "present",
            title: `${current.name} đã ra nước`,
            detail: next ? `${next.name} tới lượt` : "Đang chuyển lượt",
            color: "#CBD5E1",
          });
        } catch (e) {
          console.error("Lỗi lượt máy:", e);
          setRulesError(e instanceof Error ? e.message : "Lượt máy gặp lỗi.");
        }
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [game, gameMode, isMuted]);

  /* ── Nối từ Trung tâm Chơi: ?mode=bot|pass|online&seed=YYYYMMDD ─────────── */
  useEffect(() => {
    const { mode, seed } = readBoardParams();
    if (!mode && seed === null) return;

    const frame = requestAnimationFrame(() => {
      setGameMode(mode ?? "bot");
      if (mode === "online") return; // phòng online chờ người chơi nối vào

      const count = 2;
      const nextGame =
        mode === "pass"
          ? createGame({
              playerCount: count,
              botCount: 0,
              names: ["Người chơi 1", "Người chơi 2"].slice(0, count),
              seed: seed ?? randomSeed(),
            })
          : createGame({
              playerCount: 1,
              botCount: count - 1,
              names: ["Bạn", "Máy 1"].slice(0, count),
              seed: seed ?? 42,
            });
      setGame(nextGame);
      setPassScreenLocked(false);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  /* ── Ba nước của người chơi ──────────────────────────────────────────────── */
  const sendOnline = (payload: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  const handlePickMarket = (index: number) => {
    if (!myTurn || game.over) return;
    const card = game.market[index];
    if (!card) return;
    try {
      if (!isMuted) soundEngine.playElementTone(card.element);
      const cfg = ELEMENT_CONFIG[card.element];
      triggerFlash({
        kind: "pick",
        title: "Chọn nhạc cụ",
        detail: `${card.name} · họ ${cfg.name} về tay ${activePlayer.name}`,
        color: cfg.color,
      });
      setEnteringId(card.instanceId);
      window.setTimeout(() => setEnteringId(null), 500);
      setPickedCardId(null);
      if (gameMode === "online") {
        sendOnline({ type: "ACTION_PICK_MARKET", marketIndex: index });
        return;
      }
      const nextGame = pickFromMarket(game, index);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      setRulesError(err instanceof Error ? err.message : "Nước đi không hợp lệ.");
    }
  };

  const handlePresentCombo = (combo: ComboResult) => {
    if (!myTurn || game.over) return;
    try {
      if (!isMuted && combo.cards[0]) soundEngine.playElementTone(combo.cards[0].element);
      const meta = COMBO_LABELS[combo.kind] ?? { label: combo.kind, desc: "", score: combo.score };
      triggerFlash({
        kind: "present",
        title: `Trình tấu · ${meta.label}`,
        detail: `+${combo.score} điểm · ${combo.cards.map((c) => c.name).join(" · ")}`,
        color: ELEMENT_CONFIG[combo.cards[0]?.element ?? "tho"].color,
      });
      setPickedCardId(null);
      if (gameMode === "online") {
        sendOnline({ type: "ACTION_PRESENT_COMBO", combo });
        return;
      }
      const nextGame = presentCombo(game, combo, 0);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      setRulesError(err instanceof Error ? err.message : "Nước đi không hợp lệ.");
    }
  };

  const handleBreakSound = (opt: BreakSoundTarget) => {
    if (!myTurn || game.over) return;
    try {
      if (!isMuted) soundEngine.playElementTone("kim");
      const acting = activePlayer.hand.find((c) => c.instanceId === opt.actingCardInstanceId);
      const victim = game.players.find((p) => p.id === opt.targetPlayerId);
      const target = victim?.hand.find((c) => c.instanceId === opt.targetCardInstanceId);
      triggerFlash({
        kind: "break",
        title: "Phá âm",
        detail:
          acting && target && victim
            ? `${acting.name} ép ${victim.name} bỏ ${target.name}`
            : "Nước khắc chế đã đi",
        color: "#1F3F7E",
      });
      setPickedCardId(null);
      if (gameMode === "online") {
        sendOnline({ type: "ACTION_BREAK_SOUND", target: opt });
        return;
      }
      const nextGame = breakSound(game, opt);
      setGame(nextGame);
      checkPassScreen(nextGame);
    } catch (err: unknown) {
      setRulesError(err instanceof Error ? err.message : "Nước đi không hợp lệ.");
    }
  };

  const checkPassScreen = (nextGame: GameState) => {
    if (gameMode === "pass" && !nextGame.over) setPassScreenLocked(true);
  };

  const showBoard = gameMode !== "online" || onlineStatus === "playing";

  return (
    <div className="min-h-screen flex flex-col select-none" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      {/* ═══ THANH TRÊN ═══ */}
      <header className="sticky top-0 z-30 border-b-2 border-[#16141A] bg-[#121016]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-3 py-2 flex flex-wrap items-center gap-2">
          <Link
            href="/choi"
            className="tap inline-flex items-center gap-1 rounded-[3px] px-1.5 text-label font-bold text-white/65 hover:text-white"
          >
            <IconChevronLeft size={16} aria-hidden /> <span className="hidden sm:inline">Trung tâm Chơi</span>
          </Link>
          <h1 className="font-display font-black text-body-sm sm:text-body text-white">Sân Đấu Ngũ Cung</h1>
          <span className="text-micro font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] border border-[#F2B632]/50 text-[#F2B632]">
            Bé 7+
          </span>

          <div className="ml-auto flex rounded-[4px] border-2 border-[#16141A] bg-white/6 p-1">
            {([
              { id: "bot", label: "Đấu máy", Icon: IconGamepad },
              { id: "pass", label: "Chuyền máy", Icon: IconUsers },
              { id: "online", label: "Trực tuyến", Icon: IconSearch },
            ] as const).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => (id === "online" ? setGameMode("online") : handleRestart(id, playerCount))}
                aria-pressed={gameMode === id}
                className={`tap inline-flex items-center gap-1.5 px-2.5 rounded-[3px] text-label font-bold transition-colors
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${gameMode === id ? "bg-[#F2B632] text-[#16141A]" : "text-white/60 hover:text-white"}`}
              >
                <Icon size={15} aria-hidden />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>

          {gameMode !== "online" && (
            <label className="flex items-center gap-1.5 text-micro font-bold text-white/55">
              <span className="hidden sm:inline">Người</span>
              <select
                value={playerCount}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setPlayerCount(count);
                  handleRestart(gameMode, count);
                }}
                className="tap-w rounded-[3px] border-2 border-[#16141A] bg-[#1E1C26] px-1.5 text-label font-bold text-white"
              >
                {[2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          )}

          <button
            onClick={handleToggleSound}
            aria-pressed={!isMuted}
            className="tap flex items-center justify-center rounded-[3px] border-2 border-[#16141A] bg-white/8 text-white/70 hover:text-white"
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isMuted
              ? <IconVolumeMute size={18} aria-hidden />
              : <IconVolume size={18} className="text-[#F2B632]" aria-hidden />}
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="tap flex items-center gap-1.5 rounded-[3px] border-2 border-[#16141A] bg-[#F2B632] px-2 text-[#16141A] text-label font-black shadow-[2px_2px_0px_#16141A] hover:brightness-105"
          >
            <IconQuestion size={16} aria-hidden /> Luật
          </button>
          <button
            onClick={() => handleRestart()}
            className="tap flex items-center justify-center rounded-[3px] border-2 border-[#16141A] bg-white/8 text-white/70 hover:text-white"
            aria-label="Chia ván mới"
            title="Chia ván mới"
          >
            <IconCycle size={18} aria-hidden />
          </button>
        </div>
      </header>

      {/* ═══ BÀN CHƠI ═══ */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-3 pb-6 pt-3 grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-[minmax(0,1fr)_336px] md:items-start">
        {/* Trạng thái lượt */}
        <section className="md:col-span-2 surface-night px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p className="font-display font-black text-body-sm text-white">
            {game.over ? "Ván đã kết thúc" : `Đến lượt ${activePlayer.name}`}
          </p>
          <p className="text-label text-white/55" aria-live="polite">
            {game.over
              ? "Xem tổng kết để biết mỗi người đã trình tấu gì."
              : myTurn
              ? "Một nước duy nhất: nhặt lá Chợ · Trình tấu · Phá âm"
              : botTurn
              ? "Máy đang cân nhắc…"
              : "Chờ mở bài"}
          </p>
          <p className="ml-auto text-label tabular-nums text-white/60">
            Mốc thắng <b className="text-[#F2B632]">{WIN_THRESHOLD}</b>đ
          </p>
        </section>

        {/* Phòng chờ trực tuyến */}
        {gameMode === "online" && onlineStatus !== "playing" && (
          <section className="md:col-span-2 surface-night p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display font-black text-body text-white">Phòng chơi trực tuyến</h2>
              <span className="text-micro font-black uppercase tracking-wider px-2 py-0.5 rounded-[3px] border border-[#F2B632]/50 text-[#F2B632]">
                Sắp có · Bản thử
              </span>
            </div>
            <p className="text-label text-white/55">
              Màn phòng chơi đã dựng xong nhưng cần máy chủ chạy ở cổng 4000. Chưa có máy chủ thì chọn
              Đấu máy hoặc Chuyền máy — hai chế độ đó chạy trọn trên máy này.
            </p>

            {onlineError && (
              <p className="rounded-[4px] border-2 border-[#FFB4A2]/60 bg-[#D23A22]/20 p-3 text-label font-bold text-white flex items-start gap-2">
                <IconWarning size={16} className="shrink-0 mt-0.5" aria-hidden /> {onlineError}
              </p>
            )}

            {onlineStatus === "disconnected" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="online-name" className="block text-micro font-black uppercase tracking-wider text-white/50">
                    Tên hiển thị
                  </label>
                  <input
                    id="online-name"
                    type="text"
                    maxLength={15}
                    value={onlinePlayerName}
                    onChange={(e) => setOnlinePlayerName(e.target.value)}
                    placeholder="Ví dụ: Bé An"
                    className="w-full max-w-xs px-3 py-2.5 rounded-[3px] bg-white/10 border-2 border-white/20 text-body-sm font-bold text-white placeholder:text-white/35"
                  />
                  <button
                    onClick={() => connectOnlineRoom("create")}
                    className="tap w-full max-w-xs mt-1 rounded-[4px] border-[3px] border-[#16141A] bg-[#D23A22] text-white
                      font-black text-body-sm shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 transition-all"
                  >
                    Tạo phòng mới
                  </button>
                </div>
                <div className="space-y-2">
                  <label htmlFor="online-code" className="block text-micro font-black uppercase tracking-wider text-white/50">
                    Vào phòng bằng mã 4 ký tự
                  </label>
                  <div className="flex gap-2 items-start">
                    <input
                      id="online-code"
                      type="text"
                      maxLength={4}
                      value={onlineInputCode}
                      onChange={(e) => setOnlineInputCode(e.target.value.toUpperCase())}
                      placeholder="ABCD"
                      className="w-28 px-3 py-2.5 rounded-[3px] bg-white/10 border-2 border-white/20 text-center font-mono text-body font-black tracking-widest uppercase text-white placeholder:text-white/35"
                    />
                    <button
                      disabled={onlineInputCode.trim().length !== 4}
                      onClick={() => connectOnlineRoom("join")}
                      className="tap-w rounded-[4px] border-2 border-[#16141A] bg-[#F2B632] px-4 text-[#16141A] font-black text-body-sm shadow-[2px_2px_0px_#16141A] disabled:opacity-35"
                    >
                      Vào phòng
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-micro font-black uppercase tracking-widest text-white/45">Mã phòng</span>
                  <span className="font-mono font-black text-h3 tracking-widest text-[#F2B632] px-3 py-1 rounded-[4px] border-2 border-white/20 bg-white/6">
                    {onlineRoomCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(onlineRoomCode);
                      setOnlineCopied(true);
                      window.setTimeout(() => setOnlineCopied(false), 2000);
                    }}
                    className="tap flex items-center justify-center rounded-[3px] border-2 border-white/20 text-white/70 hover:text-white"
                    aria-label="Sao chép mã phòng"
                  >
                    {onlineCopied
                      ? <IconCheck size={18} className="text-[#7FD189]" aria-hidden />
                      : <IconLink size={18} aria-hidden />}
                  </button>
                </div>

                {onlineRoomPlayers.length === 0 ? (
                  <p className="text-label text-white/45 italic">Chưa ghi nhận người chơi nào trong phòng.</p>
                ) : (
                  <ul className="list-none m-0 p-0 space-y-1">
                    {onlineRoomPlayers.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 text-label font-bold text-white/75 py-1">
                        <span className="w-2 h-2 rounded-full bg-[#7FD189]" aria-hidden />
                        {p.name} {p.id === onlineMyPlayerId && <span className="text-white/40">(bạn)</span>}
                        {p.isHost && (
                          <span className="ml-auto text-micro font-black px-1.5 py-0.5 rounded-[3px] bg-[#D23A22] text-white">
                            Chủ phòng
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {onlineIsHost ? (
                  <button
                    onClick={startOnlineGame}
                    className="tap w-full max-w-sm rounded-[4px] border-[3px] border-[#16141A] bg-[#D23A22] text-white
                      font-black text-body-sm shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 transition-all"
                  >
                    Bắt đầu ván
                  </button>
                ) : (
                  <p className="text-label font-bold text-[#F2B632]">Đang đợi chủ phòng bắt đầu ván…</p>
                )}
              </div>
            )}
          </section>
        )}

        {showBoard && (
          <>
            {/* Người chơi quanh bàn */}
            <section
              className="md:col-start-1 md:row-start-2 -mx-3 px-3"
              aria-label="Người chơi quanh bàn"
            >
              <ul className="flex gap-2 overflow-x-auto scrollbar-hide list-none m-0 p-1">
                {game.players.map((p, idx) => {
                  const isTurn = idx === game.currentPlayerIndex && !game.over;
                  return (
                    <li
                      key={p.id}
                      className={`shrink-0 rounded-[4px] border-2 px-3 py-2 min-w-[132px] transition-all ${
                        isTurn
                          ? "border-[#F2B632] bg-[#F2B632]/18"
                          : "border-white/12 bg-white/5"
                      }`}
                    >
                      <p className="flex items-center gap-1.5 text-label font-black text-white truncate">
                        {p.name}
                        {p.isBot && <IconGamepad size={12} className="text-white/45" aria-hidden />}
                      </p>
                      <p className="flex items-baseline gap-2 mt-0.5">
                        <span
                          className="font-display font-black text-body tabular-nums"
                          style={{ color: isTurn ? "#F2B632" : "#E8EAE0" }}
                        >
                          {p.score}
                        </span>
                        <span className="text-micro text-white/45 tabular-nums">
                          /{WIN_THRESHOLD}đ · {p.hand.length} lá
                        </span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* MẶT BÀN: Chợ Nhạc + hai cọc */}
            <section
              className="md:col-start-1 md:row-start-3 rounded-[10px] border-[3px] border-[#16141A] p-3 sm:p-5"
              style={{
                background: "radial-gradient(120% 100% at 50% 0%, #1A2140 0%, #12172C 48%, #0C0E1A 100%)",
                boxShadow: "inset 0 0 0 5px rgba(242,182,50,.10), 6px 6px 0 rgba(0,0,0,.55)",
              }}
              aria-label="Giữa bàn: Chợ Nhạc và hai cọc bài"
            >
              <TableFelt
                market={game.market}
                deckCount={game.deck.length}
                discardCount={game.discard.length}
                canPick={canPickMarket}
                onPick={handlePickMarket}
              />
            </section>

            {/* NƯỚC ĐI — cột phải trên desktop, giữa bàn trên điện thoại */}
            <aside className="md:col-start-2 md:row-start-2 md:row-span-3 space-y-3">
              <div className="surface-night p-3">
                <h2 className="font-display font-black text-body-sm text-white flex items-center gap-2">
                  <IconHand size={16} className="text-[#F2B632]" aria-hidden /> Nước đi của {activePlayer.name}
                </h2>
                <p className="text-label text-white/50 mt-1">
                  Chạm một lá dưới để chỉ xem nước đi dùng lá đó.
                </p>
                {pickedCardId && (
                  <button
                    onClick={() => setPickedCardId(null)}
                    className="tap-w mt-2 inline-flex items-center gap-1.5 text-micro font-black px-2 py-1 rounded-[3px] border border-white/25 text-white/70 hover:text-white"
                  >
                    <IconClose size={12} aria-hidden /> Bỏ lọc
                  </button>
                )}
              </div>

              {/* TRÌNH TẤU */}
              <div className="surface-night p-3 space-y-2">
                <p className="text-label font-black text-white flex items-center gap-2">
                  <IconSparkles size={15} className="text-[#D23A22]" aria-hidden />
                  Trình tấu ({visibleCombos.length})
                </p>
                {visibleCombos.length === 0 ? (
                  <p className="text-label text-white/45 italic">
                    {pickedCardId
                      ? "Lá này chưa ghép thành tổ hợp nào."
                      : "Chưa đủ lá ghép tổ hợp. Nhặt thêm lá Chợ cùng họ hoặc cho đủ năm hành."}
                  </p>
                ) : (
                  <ul className="list-none m-0 p-0 space-y-2">
                    {visibleCombos.map((combo, idx) => {
                      const meta = COMBO_LABELS[combo.kind] ?? { label: combo.kind, desc: "", score: combo.score };
                      const lead = ELEMENT_CONFIG[combo.cards[0]?.element ?? "tho"];
                      return (
                        <li key={`${combo.kind}-${idx}`}>
                          <button
                            onClick={() => handlePresentCombo(combo)}
                            disabled={!myTurn}
                            className="tap-w w-full rounded-[4px] border-2 border-[#16141A] p-2.5 text-left
                              shadow-[2px_2px_0px_#16141A] hover:-translate-y-0.5 active:translate-y-0 transition-all
                              disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed
                              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                            style={{ backgroundColor: lead.color }}
                          >
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="font-display font-black text-label text-[#16141A]">{meta.label}</span>
                              <span className="font-display font-black text-body tabular-nums text-[#16141A]">
                                +{combo.score}
                              </span>
                            </span>
                            <span className="block text-micro font-bold text-[#16141A]/75 mt-0.5">{meta.desc}</span>
                            <span className="mt-1.5 flex flex-wrap gap-1">
                              {combo.cards.map((c) => (
                                <span
                                  key={c.instanceId}
                                  className="text-micro font-bold rounded-[2px] px-1 py-0.5 bg-[#16141A]/85 text-white"
                                >
                                  {c.name}
                                </span>
                              ))}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* PHÁ ÂM */}
              <div className="surface-night p-3 space-y-2">
                <p className="text-label font-black text-white flex items-center gap-2">
                  <IconSwords size={15} className="text-[#93B4E8]" aria-hidden />
                  Phá âm ({visibleBreaks.length})
                </p>
                {visibleBreaks.length === 0 ? (
                  <p className="text-label text-white/45 italic">
                    {pickedCardId
                      ? "Lá này không khắc lá nào trên tay đối thủ."
                      : "Chưa có mục tiêu khắc chế. Cứ trình tấu hoặc nhặt lá Chợ."}
                  </p>
                ) : (
                  <ul className="list-none m-0 p-0 space-y-2">
                    {visibleBreaks.slice(0, 8).map((opt, idx) => {
                      const victim = game.players.find((p) => p.id === opt.targetPlayerId);
                      const acting = activePlayer.hand.find((c) => c.instanceId === opt.actingCardInstanceId);
                      const targetCard = victim?.hand.find((c) => c.instanceId === opt.targetCardInstanceId);
                      if (!victim || !acting || !targetCard) return null;
                      const aCfg = ELEMENT_CONFIG[acting.element];
                      return (
                        <li key={`${opt.targetPlayerId}-${idx}`}>
                          <button
                            onClick={() => handleBreakSound(opt)}
                            disabled={!myTurn}
                            className="tap-w w-full rounded-[4px] border-2 border-[#16141A] p-2.5 text-left
                              bg-[#1F3F7E] text-white shadow-[2px_2px_0px_#16141A]
                              hover:-translate-y-0.5 active:translate-y-0 transition-all
                              disabled:opacity-40 disabled:cursor-not-allowed
                              focus-visible:outline-2 focus-visible:outline-[#F2B632]"
                          >
                            <span className="flex items-baseline justify-between gap-2">
                              <span className="text-label font-black">Ép bỏ {victim.name}</span>
                              <span className="text-micro font-bold opacity-80">{aCfg.name} khắc</span>
                            </span>
                            <span className="mt-1 flex items-center gap-1.5 text-micro font-bold opacity-90">
                              {acting.name} <IconArrowRight size={11} aria-hidden /> bỏ {targetCard.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Diễn biến */}
              <div className="surface-night p-3">
                <p className="text-micro font-black uppercase tracking-widest text-white/45 mb-1">Diễn biến</p>
                <ul className="list-none m-0 p-0 space-y-1 max-h-40 overflow-y-auto text-label text-white/65">
                  {game.log.length === 0 && (
                    <li className="italic text-white/35">Ván vừa chia, chưa có diễn biến.</li>
                  )}
                  {game.log.slice().reverse().slice(0, 30).map((entry, i) => (
                    <li key={i} className="flex gap-1.5">
                      <IconChevronRight size={12} className="shrink-0 mt-1 text-white/25" aria-hidden />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* TAY BÀI — cánh quạt sát mép dưới cho ngón cái */}
            <section
              className="md:col-start-1 md:row-start-4 surface-night p-2 sm:p-3"
              aria-label={`Tay bài của ${activePlayer.name}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1">
                <p className="text-label font-black text-white">
                  Tay bài {activePlayer.name}
                  <span className="ml-2 font-bold text-white/45 tabular-nums">
                    {activePlayer.hand.length}/{HAND_LIMIT} lá
                  </span>
                </p>
                <p className="text-micro text-white/45">Lá sáng viền là lá đang có nước đi</p>
              </div>
              <HandFan
                cards={activePlayer.hand}
                legalIds={legalHandIds}
                enteringId={enteringId}
                disabled={!myTurn}
                onSelect={(card: CardInstance) =>
                  setPickedCardId((prev) => (prev === card.instanceId ? null : card.instanceId))
                }
              />
            </section>
          </>
        )}

        {/* Trạng thái lỗi — có thiết kế, không dùng alert() */}
        {rulesError && (
          <div className="md:col-span-2 rounded-[4px] border-2 border-[#FFB4A2]/70 bg-[#D23A22]/20 p-3 flex items-start gap-2">
            <IconWarning size={18} className="shrink-0 text-[#FFB4A2]" aria-hidden />
            <p className="text-label font-bold text-white flex-1">{rulesError}</p>
            <button
              onClick={() => setRulesError(null)}
              className="tap-w flex items-center justify-center rounded-[3px] text-white/70 hover:text-white"
              aria-label="Đóng thông báo"
            >
              <IconClose size={16} aria-hidden />
            </button>
          </div>
        )}

        <p className="md:col-span-2 text-label text-white/35 flex items-center gap-2">
          <IconMusicNote size={14} aria-hidden />
          Âm phát khi ra nước là âm mô phỏng bằng Web Audio, chưa phải thu âm nhạc cụ thật.
        </p>
      </main>

      {/* ═══ HOẠT ẢNH NƯỚC ĐI ═══ */}
      <ActionFlash flash={flash} />

      {/* ═══ MÀN CHUYỀN MÁY ═══ */}
      {passScreenLocked && !game.over && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0C14]/92 backdrop-blur-sm">
          <div className="surface-night max-w-md w-full p-6 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-[6px] border-[3px] border-[#16141A] bg-[#F2B632]
              flex items-center justify-center shadow-[4px_4px_0px_#16141A]">
              <IconUsers size={32} className="text-[#16141A]" aria-hidden />
            </div>
            <div className="space-y-2">
              <h2 className="font-display font-black text-h3 text-white">Chuyền máy</h2>
              <p className="text-body-sm text-white/65">
                Đưa thiết bị cho <span className="font-black text-[#F2B632]">{activePlayer.name}</span> rồi mở bài.
                Người khác chưa nên nhìn tay bài này.
              </p>
            </div>
            <button
              onClick={() => setPassScreenLocked(false)}
              className="tap w-full rounded-[4px] border-[3px] border-[#16141A] bg-[#D23A22] text-white
                font-black text-body-sm shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 transition-all"
            >
              Tôi là {activePlayer.name}, mở bài
            </button>
          </div>
        </div>
      )}

      {/* ═══ TỔNG KẾT SAU VÁN ═══ */}
      {game.over && <GameSummary game={game} onRestart={() => handleRestart()} />}

      {/* ═══ LUẬT NHANH 7+ ═══ */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0C14]/92 backdrop-blur-sm overflow-y-auto">
          <div className="surface-night max-w-lg w-full p-5 sm:p-6 space-y-4 my-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display font-black text-body text-white flex items-center gap-2">
                <IconQuestion size={18} className="text-[#F2B632]" aria-hidden /> Luật nhanh cho bé 7+
              </h2>
              <button
                onClick={() => setShowTutorial(false)}
                className="tap flex items-center justify-center rounded-[3px] text-white/60 hover:text-white"
                aria-label="Đóng hướng dẫn"
              >
                <IconClose size={18} aria-hidden />
              </button>
            </div>

            <ol className="list-none m-0 p-0 space-y-2.5">
              {[
                {
                  n: 1, bg: "#F2B632", fg: "#16141A",
                  t: "Mỗi lượt làm đúng 1 việc",
                  d: "Nhặt 1 lá từ Chợ Nhạc, hoặc Trình tấu một tổ hợp, hoặc Phá âm đối thủ.",
                },
                {
                  n: 2, bg: "#D23A22", fg: "#FFFFFF",
                  t: "Bốn cách ghi điểm",
                  d: "Đồng âm 2đ (3 lá cùng họ) · Liên hoàn 2đ (cặp sinh, được tặng 1 lá Chợ) · Hợp tấu 4đ (3 nhạc cụ khác nhau cùng họ) · Ngũ cung 8đ (đủ 5 hành).",
                },
                {
                  n: 3, bg: "#1F3F7E", fg: "#FFFFFF",
                  t: "Phá âm",
                  d: "Bỏ 1 lá của mình để ép đối thủ bỏ 1 lá thuộc hành bị lá đó khắc (Mộc khắc Thổ, Thổ khắc Thủy…).",
                },
                {
                  n: 4, bg: "#3F7D3B", fg: "#FFFFFF",
                  t: `Ai chạm ${WIN_THRESHOLD} điểm trước thì thắng`,
                  d: "Hòa điểm thì phân định bằng số lần Hợp tấu.",
                },
              ].map((row) => (
                <li key={row.n} className="flex items-start gap-3 rounded-[4px] border-2 border-white/12 bg-white/5 p-3">
                  <span
                    className="w-7 h-7 shrink-0 rounded-[3px] border-2 border-[#16141A] flex items-center justify-center font-display font-black text-label"
                    style={{ backgroundColor: row.bg, color: row.fg }}
                  >
                    {row.n}
                  </span>
                  <span>
                    <span className="block text-label font-black text-white">{row.t}</span>
                    <span className="block text-label text-white/65 mt-0.5">{row.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowTutorial(false)}
                className="tap flex-1 min-w-[160px] rounded-[4px] border-[3px] border-[#16141A] bg-[#F2B632] text-[#16141A]
                  font-black text-body-sm shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 transition-all"
              >
                Đã hiểu, chơi tiếp
              </button>
              <Link href="/luat-choi" className="cta-ghost flex-1 justify-center min-w-[150px]">
                Luật đầy đủ <IconArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
