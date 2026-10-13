/**
 * ==============================================================================
 * FILE: lib/rules/types.ts
 * MỤC ĐÍCH: Kiểu dữ liệu thuần TypeScript cho Lõi luật Ngũ Cung:
 * - Độc lập hoàn toàn với React / DOM
 * - Dùng chung cho Game Engine, Bot AI, Chuyền máy, WebSocket Server
 * ==============================================================================
 */

export type ElementType = "tho" | "kim" | "moc" | "hoa" | "thuy";

export type ComboKind = "dong-am" | "hop-tau" | "lien-hoan" | "ngu-cung";

export interface CardInstance {
  instanceId: string;
  instrumentId: string;
  name: string;
  element: ElementType;
}

export interface ComboResult {
  kind: ComboKind;
  cards: CardInstance[];
  score: number;
}

export interface PlayerState {
  id: string;
  name: string;
  isBot: boolean;
  hand: CardInstance[];
  score: number;
  hopTauCount: number; // Đếm số lần Hợp tấu để phân định hòa (Tiebreak)
  presentedHistory: { combo: ComboKind; cards: CardInstance[]; score: number }[];
}

export interface GameState {
  seed: number;
  deck: CardInstance[];
  market: CardInstance[];
  discard: CardInstance[];
  players: PlayerState[];
  currentPlayerIndex: number;
  endRoundTriggeredBy: string | null;
  turnsRemainingInFinalRound: number;
  winnerId: string | null;
  log: string[];
  over: boolean;
}

export type ActionType = "pick-market" | "present" | "break-sound";

export interface BreakSoundTarget {
  actingCardInstanceId: string;
  targetPlayerId: string;
  targetCardInstanceId: string;
}
