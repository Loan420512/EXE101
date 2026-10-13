/**
 * FILE: lib/game/engine.ts
 * MỤC ĐÍCH: Luật thuần TypeScript — chia bài, 3 hành động, combo, giới hạn 7 lá, 15 điểm.
 */

import { INSTRUMENTS, isShengAdjacent, type ElementType } from "@/data/instruments";
import { mulberry32, shuffle } from "./rng";
import type { CardInstance, ComboResult, GameState, PlayerState } from "./types";

export const HAND_LIMIT = 7;
export const WIN_THRESHOLD = 15;
export const START_HAND = 5;
export const MARKET_SIZE = 5;
export const COPIES_PER_INSTRUMENT = 3;

export function buildDeck(rand: () => number): CardInstance[] {
  const cards: CardInstance[] = [];
  for (const inst of INSTRUMENTS) {
    for (let copy = 0; copy < COPIES_PER_INSTRUMENT; copy += 1) {
      cards.push({
        instanceId: `${inst.id}-${copy}`,
        instrumentId: inst.id,
        name: inst.name,
        element: inst.element,
      });
    }
  }
  return shuffle(cards, rand);
}

function refillMarket(state: GameState) {
  while (state.market.length < MARKET_SIZE && state.deck.length > 0) {
    const card = state.deck.pop();
    if (card) state.market.push(card);
  }
}

export function createGame(opts: {
  seed: number;
  playerCount: number;
  botCount?: number;
  names?: string[];
}): GameState {
  const rand = mulberry32(opts.seed);
  const deck = buildDeck(rand);
  const humans = opts.playerCount;
  const bots = opts.botCount ?? 0;
  const players: PlayerState[] = [];
  for (let i = 0; i < humans + bots; i += 1) {
    const isBot = i >= humans;
    const name = opts.names?.[i] ?? (isBot ? `Máy ${i - humans + 1}` : `Người ${i + 1}`);
    players.push({
      id: `p${i}`,
      name,
      isBot,
      hand: [],
      score: 0,
      presented: [],
    });
  }
  for (let round = 0; round < START_HAND; round += 1) {
    for (const player of players) {
      const card = deck.pop();
      if (card) player.hand.push(card);
    }
  }
  const market: CardInstance[] = [];
  while (market.length < MARKET_SIZE) {
    const card = deck.pop();
    if (!card) break;
    market.push(card);
  }
  return {
    seed: opts.seed,
    deck,
    market,
    discard: [],
    players,
    currentPlayer: 0,
    endRoundTriggeredBy: null,
    turnsAfterEnd: 0,
    winnerId: null,
    log: ["Chia bài xong. Chợ Nhạc có 5 lá."],
    over: false,
  };
}

export function current(state: GameState): PlayerState {
  const player = state.players[state.currentPlayer];
  if (!player) throw new Error("Người chơi không tồn tại");
  return player;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function finishTurn(state: GameState): GameState {
  if (state.endRoundTriggeredBy) {
    state.turnsAfterEnd += 1;
    if (state.turnsAfterEnd >= state.players.length) {
      state.over = true;
      const ranked = [...state.players].sort((a, b) => b.score - a.score);
      state.winnerId = ranked[0]?.id ?? null;
      state.log.push("Vòng kết thúc. Người điểm cao nhất thắng.");
      return state;
    }
  }
  state.currentPlayer = (state.currentPlayer + 1) % state.players.length;
  return state;
}

export function pickFromMarket(state: GameState, marketIndex: number): GameState {
  const next = clone(state);
  const player = current(next);
  if (player.hand.length >= HAND_LIMIT) {
    throw new Error("Tay đã đủ 7 lá, không thể lấy thêm.");
  }
  const card = next.market.splice(marketIndex, 1)[0];
  if (!card) throw new Error("Không có lá ở vị trí Chợ Nhạc đó.");
  player.hand.push(card);
  refillMarket(next);
  next.log.push(`${player.name} chọn ${card.name} từ Chợ Nhạc.`);
  return finishTurn(next);
}

export function drawFromDeck(state: GameState): GameState {
  const next = clone(state);
  const player = current(next);
  if (player.hand.length >= HAND_LIMIT) {
    throw new Error("Tay đã đủ 7 lá, không thể rút thêm.");
  }
  const card = next.deck.pop();
  if (!card) throw new Error("Hết chồng bài rút.");
  player.hand.push(card);
  next.log.push(`${player.name} rút 1 lá úp.`);
  return finishTurn(next);
}

export function breakSound(state: GameState, handIndexes: number[]): GameState {
  const next = clone(state);
  const player = current(next);
  if (handIndexes.length !== 2) throw new Error("Phá âm cần đúng 2 lá trên tay.");
  const unique = [...new Set(handIndexes)].sort((a, b) => b - a);
  if (unique.length !== 2) throw new Error("Hai lá Phá âm phải khác nhau.");
  const moving: CardInstance[] = [];
  for (const index of unique) {
    const card = player.hand.splice(index, 1)[0];
    if (!card) throw new Error("Lá trên tay không hợp lệ.");
    moving.push(card);
  }
  next.market.push(...moving);
  while (next.market.length > MARKET_SIZE) {
    const extra = next.market.shift();
    if (extra) next.discard.push(extra);
  }
  next.log.push(`${player.name} Phá âm, đổi 2 lá vào Chợ Nhạc.`);
  return finishTurn(next);
}

export function findCombos(hand: CardInstance[]): ComboResult[] {
  const results: ComboResult[] = [];
  const byElement = new Map<ElementType, CardInstance[]>();
  for (const card of hand) {
    const list = byElement.get(card.element) ?? [];
    list.push(card);
    byElement.set(card.element, list);
  }

  for (const group of byElement.values()) {
    if (group.length >= 3) {
      const triple = group.slice(0, 3);
      const uniqueNames = new Set(triple.map((c) => c.instrumentId));
      if (uniqueNames.size === 3) {
        results.push({ kind: "hop-tau", cards: triple, score: 4, drawBonus: 0 });
      } else {
        results.push({ kind: "dong-am", cards: triple, score: 2, drawBonus: 0 });
      }
    }
  }

  for (let i = 0; i < hand.length; i += 1) {
    for (let j = i + 1; j < hand.length; j += 1) {
      const a = hand[i];
      const b = hand[j];
      if (!a || !b) continue;
      if (a.element !== b.element && isShengAdjacent(a.element, b.element)) {
        results.push({ kind: "lien-hoan", cards: [a, b], score: 2, drawBonus: 1 });
      }
    }
  }

  const families = new Set(hand.map((c) => c.element));
  if (families.size === 5) {
    const picked: CardInstance[] = [];
    const seen = new Set<ElementType>();
    for (const card of hand) {
      if (!seen.has(card.element)) {
        seen.add(card.element);
        picked.push(card);
      }
    }
    results.push({ kind: "ngu-cung", cards: picked, score: 8, drawBonus: 0 });
  }

  results.sort((a, b) => b.score - a.score || b.drawBonus - a.drawBonus);
  return results;
}

export function presentCombo(state: GameState, combo: ComboResult): GameState {
  const next = clone(state);
  const player = current(next);
  const ids = new Set(combo.cards.map((c) => c.instanceId));
  const remaining = player.hand.filter((c) => !ids.has(c.instanceId));
  if (player.hand.length - remaining.length !== combo.cards.length) {
    throw new Error("Combo không nằm trọn trên tay.");
  }
  player.hand = remaining;
  player.presented.push(...combo.cards);
  player.score += combo.score;
  for (let i = 0; i < combo.drawBonus; i += 1) {
    if (player.hand.length >= HAND_LIMIT) break;
    const extra = next.deck.pop();
    if (extra) player.hand.push(extra);
  }
  next.log.push(`${player.name} trình tấu ${combo.kind} (+${combo.score}).`);
  if (!next.endRoundTriggeredBy && player.score >= WIN_THRESHOLD) {
    next.endRoundTriggeredBy = player.id;
    next.log.push(`${player.name} đạt ${player.score} điểm, kích hoạt vòng kết thúc.`);
  }
  return finishTurn(next);
}

export function legalActions(state: GameState): string[] {
  if (state.over) return [];
  const player = current(state);
  const actions: string[] = [];
  if (player.hand.length < HAND_LIMIT) {
    if (state.market.length) actions.push("pick-market");
    if (state.deck.length) actions.push("draw");
  }
  if (findCombos(player.hand).length) actions.push("present");
  if (player.hand.length >= 2) actions.push("break-sound");
  return actions;
}
