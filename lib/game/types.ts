/**
 * FILE: lib/game/types.ts
 * MỤC ĐÍCH: Kiểu dữ liệu lõi luật Ngũ Cung (bản nháp v0.1).
 */

import type { ElementType } from "@/data/instruments";

export type ComboKind = "dong-am" | "hop-tau" | "lien-hoan" | "ngu-cung";

export type TurnAction = "pick-market" | "draw" | "present" | "break-sound";

export interface CardInstance {
  instanceId: string;
  instrumentId: string;
  name: string;
  element: ElementType;
}

export interface PlayerState {
  id: string;
  name: string;
  isBot: boolean;
  hand: CardInstance[];
  score: number;
  presented: CardInstance[];
}

export interface GameState {
  seed: number;
  deck: CardInstance[];
  market: CardInstance[];
  discard: CardInstance[];
  players: PlayerState[];
  currentPlayer: number;
  endRoundTriggeredBy: string | null;
  turnsAfterEnd: number;
  winnerId: string | null;
  log: string[];
  over: boolean;
}

export interface ComboResult {
  kind: ComboKind;
  cards: CardInstance[];
  score: number;
  drawBonus: number;
}
