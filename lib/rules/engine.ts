/**
 * ==============================================================================
 * FILE: lib/rules/engine.ts
 * MỤC ĐÍCH: Lõi luật Ngũ Cung (Pure TypeScript Engine):
 * - Không phụ thuộc React / DOM.
 * - Chuẩn hóa bộ 45 lá (15 nhạc cụ x 3 lá).
 * - Thực thi 3 hành động: Chọn nhạc cụ, Trình tấu, Phá âm tương khắc.
 * - 4 tổ hợp hòa thanh: Đồng âm (2đ), Hợp tấu (4đ), Liên hoàn (2đ + 1 lá Chợ), Ngũ Cung (8đ).
 * - Giới hạn 7 lá trên tay.
 * - Kết thúc ở 15 điểm, chơi hết vòng, tiebreak bằng số lần Hợp tấu.
 * - Xáo cọc bài bỏ khi cọc rút hết.
 * ==============================================================================
 */

import { mulberry32, shuffle } from "./rng";
import {
  ElementType,
  ComboKind,
  CardInstance,
  ComboResult,
  PlayerState,
  GameState,
  BreakSoundTarget,
} from "./types";

export const HAND_LIMIT = 7;
export const WIN_THRESHOLD = 15;
export const START_HAND_SIZE = 5;
export const MARKET_SIZE = 5;

// Danh sách 15 nhạc cụ tiêu chuẩn
export const INSTRUMENT_DEFINITIONS: { id: string; name: string; element: ElementType }[] = [
  // THỔ (CUNG)
  { id: "dan-da", name: "Đàn đá", element: "tho" },
  { id: "trong-com", name: "Trống cơm", element: "tho" },
  { id: "tu-va", name: "Tù và", element: "tho" },
  // KIM (THƯƠNG)
  { id: "cong-chieng", name: "Cồng chiêng", element: "kim" },
  { id: "trong-dong", name: "Trống đồng", element: "kim" },
  { id: "thanh-la", name: "Thanh la", element: "kim" },
  // MỘC (GIỐC)
  { id: "dan-trung", name: "Đàn t'rưng", element: "moc" },
  { id: "sao-truc", name: "Sáo trúc", element: "moc" },
  { id: "phach", name: "Phách", element: "moc" },
  // HỎA (CHỦY)
  { id: "ken-bau", name: "Kèn bầu", element: "hoa" },
  { id: "trong-chau", name: "Trống chầu", element: "hoa" },
  { id: "dan-ty-ba", name: "Đàn tỳ bà", element: "hoa" },
  // THỦY (VŨ)
  { id: "dan-bau", name: "Đàn bầu", element: "thuy" },
  { id: "dan-tranh", name: "Đàn tranh", element: "thuy" },
  { id: "dan-nhi", name: "Đàn nhị", element: "thuy" },
];

// Chu trình Tương sinh (Directed Sheng: A sinh B)
export const SHENG_CYCLE: Record<ElementType, ElementType> = {
  moc: "hoa", // Mộc sinh Hỏa
  hoa: "tho", // Hỏa sinh Thổ
  tho: "kim", // Thổ sinh Kim
  kim: "thuy", // Kim sinh Thủy
  thuy: "moc", // Thủy sinh Mộc
};

// Chu trình Tương khắc (Ke: A khắc B)
export const KE_CYCLE: Record<ElementType, ElementType> = {
  moc: "tho", // Mộc khắc Thổ
  tho: "thuy", // Thổ khắc Thủy
  thuy: "hoa", // Thủy khắc Hỏa
  hoa: "kim", // Hỏa khắc Kim
  kim: "moc", // Kim khắc Mộc
};

export function buildDeck(rand: () => number = Math.random): CardInstance[] {
  const cards: CardInstance[] = [];
  for (const inst of INSTRUMENT_DEFINITIONS) {
    for (let copy = 0; copy < 3; copy++) {
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

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

// Bù cọc Chợ Nhạc (tự động xáo cọc bỏ nếu cọc rút cạn)
function ensureRefillMarket(state: GameState) {
  while (state.market.length < MARKET_SIZE) {
    if (state.deck.length === 0) {
      if (state.discard.length === 0) break; // Cả hai cọc đều cạn
      const rand = mulberry32(state.seed + state.log.length);
      state.deck = shuffle(state.discard, rand);
      state.discard = [];
      state.log.push("Cọc rút hết bài: Đã xáo cọc bỏ làm cọc rút mới.");
    }
    const card = state.deck.pop();
    if (card) state.market.push(card);
  }
}

export function createGame(opts: {
  seed?: number;
  playerCount: number;
  botCount?: number;
  names?: string[];
}): GameState {
  const seed = opts.seed ?? Math.floor(Math.random() * 1000000);
  const rand = mulberry32(seed);
  const deck = buildDeck(rand);

  const humans = opts.playerCount;
  const bots = opts.botCount ?? 0;
  const totalPlayers = humans + bots;
  if (totalPlayers < 2 || totalPlayers > 5) {
    throw new Error("Số người chơi phải từ 2 đến 5.");
  }

  const players: PlayerState[] = [];
  for (let i = 0; i < totalPlayers; i++) {
    const isBot = i >= humans;
    const name = opts.names?.[i] ?? (isBot ? `Máy ${i - humans + 1}` : `Người ${i + 1}`);
    players.push({
      id: `p${i}`,
      name,
      isBot,
      hand: [],
      score: 0,
      hopTauCount: 0,
      presentedHistory: [],
    });
  }

  // Chia mỗi người 5 lá
  for (let round = 0; round < START_HAND_SIZE; round++) {
    for (const p of players) {
      const card = deck.pop();
      if (card) p.hand.push(card);
    }
  }

  // Chia 5 lá Chợ Nhạc
  const market: CardInstance[] = [];
  while (market.length < MARKET_SIZE && deck.length > 0) {
    const card = deck.pop();
    if (card) market.push(card);
  }

  return {
    seed,
    deck,
    market,
    discard: [],
    players,
    currentPlayerIndex: 0,
    endRoundTriggeredBy: null,
    turnsRemainingInFinalRound: -1,
    winnerId: null,
    log: ["Trận đấu khởi tạo thành công. Chợ Nhạc có 5 lá."],
    over: false,
  };
}

export function getCurrentPlayer(state: GameState): PlayerState {
  const p = state.players[state.currentPlayerIndex];
  if (!p) throw new Error("Không tìm thấy người chơi hiện tại");
  return p;
}

// Kiểm tra và thực thi kết thúc lượt
function finishTurn(state: GameState): GameState {
  // Giới hạn 7 lá trên tay: Nếu người chơi vượt quá 7 lá, tự động bỏ các lá dư vào cọc bỏ
  const activePlayer = getCurrentPlayer(state);
  while (activePlayer.hand.length > HAND_LIMIT) {
    const discarded = activePlayer.hand.pop();
    if (discarded) {
      state.discard.push(discarded);
      state.log.push(`${activePlayer.name} bỏ ${discarded.name} vì tay vượt quá 7 lá.`);
    }
  }

  // Kiểm tra cọc bài cạn kiệt
  if (state.deck.length === 0 && state.discard.length === 0) {
    state.over = true;
    determineWinner(state);
    state.log.push("Cả cọc rút và cọc bỏ đều hết bài: Ván đấu kết thúc!");
    return state;
  }

  // Xử lý vòng kết thúc nếu có người kích hoạt 15 điểm
  if (state.endRoundTriggeredBy) {
    state.turnsRemainingInFinalRound -= 1;
    if (state.turnsRemainingInFinalRound <= 0) {
      state.over = true;
      determineWinner(state);
      state.log.push("Vòng đấu kết thúc hoàn tất. Đã xác định người chiến thắng!");
      return state;
    }
  }

  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  return state;
}

// Xác định người chiến thắng (Tiebreak bằng số lần Hợp tấu)
function determineWinner(state: GameState) {
  const sorted = [...state.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.hopTauCount - a.hopTauCount; // Ưu tiên Hợp tấu khi hòa điểm
  });
  state.winnerId = sorted[0]?.id ?? null;
}

// -----------------------------------------------------------------------------
// HÀNH ĐỘNG 1: CHỌN NHẠC CỤ TỪ CHỢ NHẠC
// -----------------------------------------------------------------------------
export function pickFromMarket(state: GameState, marketIndex: number): GameState {
  if (state.over) throw new Error("Ván đấu đã kết thúc.");
  const next = cloneState(state);
  const player = getCurrentPlayer(next);

  if (player.hand.length >= HAND_LIMIT) {
    throw new Error("Tay đã đạt giới hạn 7 lá, không thể nhận thêm.");
  }
  if (marketIndex < 0 || marketIndex >= next.market.length) {
    throw new Error("Vị trí Chợ Nhạc không hợp lệ.");
  }

  const card = next.market.splice(marketIndex, 1)[0]!;
  player.hand.push(card);
  ensureRefillMarket(next);
  next.log.push(`${player.name} chọn ${card.name} (${card.element.toUpperCase()}) từ Chợ Nhạc.`);

  return finishTurn(next);
}

// -----------------------------------------------------------------------------
// TÌM TỔ HỢP HỢP LỆ TRÊN TAY
// -----------------------------------------------------------------------------
export function findCombos(hand: CardInstance[]): ComboResult[] {
  const combos: ComboResult[] = [];

  // 1. Combo NGŨ CUNG: 5 lá đủ 5 hành khác nhau (8 điểm)
  const byElement = new Map<ElementType, CardInstance[]>();
  for (const c of hand) {
    const list = byElement.get(c.element) ?? [];
    list.push(c);
    byElement.set(c.element, list);
  }

  if (byElement.size === 5) {
    const cards: CardInstance[] = [];
    const elements: ElementType[] = ["tho", "kim", "moc", "hoa", "thuy"];
    for (const el of elements) {
      cards.push(byElement.get(el)![0]!);
    }
    combos.push({ kind: "ngu-cung", cards, score: 8 });
  }

  // 2. HỢP TẤU (4đ) & ĐỒNG ÂM (2đ): 3 lá cùng họ
  for (const group of byElement.values()) {
    if (group.length >= 3) {
      // Xét mọi tổ hợp 3 lá trong nhóm
      for (let i = 0; i < group.length - 2; i++) {
        for (let j = i + 1; j < group.length - 1; j++) {
          for (let k = j + 1; k < group.length; k++) {
            const triple = [group[i]!, group[j]!, group[k]!];
            const uniqueInstruments = new Set(triple.map((c) => c.instrumentId));
            if (uniqueInstruments.size === 3) {
              combos.push({ kind: "hop-tau", cards: triple, score: 4 });
            } else {
              combos.push({ kind: "dong-am", cards: triple, score: 2 });
            }
          }
        }
      }
    }
  }

  // 3. LIÊN HOÀN (2đ + 1 lá từ Chợ): 2 lá có hướng tương sinh Mộc->Hỏa->Thổ->Kim->Thủy->Mộc
  for (let i = 0; i < hand.length; i++) {
    for (let j = 0; j < hand.length; j++) {
      if (i === j) continue;
      const a = hand[i]!;
      const b = hand[j]!;
      if (SHENG_CYCLE[a.element] === b.element) {
        combos.push({ kind: "lien-hoan", cards: [a, b], score: 2 });
      }
    }
  }

  // Sắp xếp ưu tiên điểm cao nhất
  combos.sort((a, b) => b.score - a.score);
  return combos;
}

// -----------------------------------------------------------------------------
// HÀNH ĐỘNG 2: TRÌNH TẤU TỔ HỢP
// -----------------------------------------------------------------------------
export function presentCombo(
  state: GameState,
  combo: ComboResult,
  extraMarketIndexForLienHoan: number = 0
): GameState {
  if (state.over) throw new Error("Ván đấu đã kết thúc.");
  const next = cloneState(state);
  const player = getCurrentPlayer(next);

  // Xác thực các lá bài nằm trong tay
  const playedInstanceIds = new Set(combo.cards.map((c) => c.instanceId));
  const remainingHand = player.hand.filter((c) => !playedInstanceIds.has(c.instanceId));
  if (player.hand.length - remainingHand.length !== combo.cards.length) {
    throw new Error("Các lá bài trình tấu không nằm đầy đủ trên tay.");
  }

  player.hand = remainingHand;
  // Bỏ các lá đã dùng vào cọc bỏ
  next.discard.push(...combo.cards);
  player.score += combo.score;

  if (combo.kind === "hop-tau") {
    player.hopTauCount += 1;
  }
  player.presentedHistory.push({ combo: combo.kind, cards: combo.cards, score: combo.score });
  next.log.push(`${player.name} trình tấu ${combo.kind.toUpperCase()} (+${combo.score} điểm).`);

  // Nếu là Liên hoàn: Lấy thêm 1 lá từ Chợ Nhạc
  if (combo.kind === "lien-hoan" && next.market.length > 0 && player.hand.length < HAND_LIMIT) {
    const idx = Math.min(extraMarketIndexForLienHoan, next.market.length - 1);
    const extraCard = next.market.splice(idx, 1)[0];
    if (extraCard) {
      player.hand.push(extraCard);
      ensureRefillMarket(next);
      next.log.push(`${player.name} nhận thêm ${extraCard.name} từ Chợ nhờ combo Liên hoàn.`);
    }
  }

  // Kiểm tra kích hoạt mốc 15 điểm
  if (!next.endRoundTriggeredBy && player.score >= WIN_THRESHOLD) {
    next.endRoundTriggeredBy = player.id;
    next.turnsRemainingInFinalRound = next.players.length - 1;
    next.log.push(`${player.name} đạt ${player.score} điểm! Kích hoạt vòng cuối.`);
  }

  return finishTurn(next);
}

// -----------------------------------------------------------------------------
// HÀNH ĐỘNG 3: PHÁ ÂM (KHẮC CHẾ ĐỐI THỦ)
// -----------------------------------------------------------------------------
export function getBreakSoundOptions(state: GameState): BreakSoundTarget[] {
  if (state.over) return [];
  const player = getCurrentPlayer(state);
  const options: BreakSoundTarget[] = [];

  for (const myCard of player.hand) {
    const targetElement = KE_CYCLE[myCard.element]; // Hành mà lá của tôi khắc

    for (const opponent of state.players) {
      if (opponent.id === player.id) continue;
      for (const oppCard of opponent.hand) {
        if (oppCard.element === targetElement) {
          options.push({
            actingCardInstanceId: myCard.instanceId,
            targetPlayerId: opponent.id,
            targetCardInstanceId: oppCard.instanceId,
          });
        }
      }
    }
  }

  return options;
}

export function breakSound(state: GameState, target: BreakSoundTarget): GameState {
  if (state.over) throw new Error("Ván đấu đã kết thúc.");
  const next = cloneState(state);
  const player = getCurrentPlayer(next);

  // 1. Kiểm tra lá của người đánh
  const myCardIdx = player.hand.findIndex((c) => c.instanceId === target.actingCardInstanceId);
  if (myCardIdx === -1) throw new Error("Lá bài Phá âm không có trên tay.");
  const myCard = player.hand.splice(myCardIdx, 1)[0]!;

  // 2. Kiểm tra đối thủ
  const opponent = next.players.find((p) => p.id === target.targetPlayerId);
  if (!opponent || opponent.id === player.id) throw new Error("Đối thủ không hợp lệ.");

  // 3. Kiểm tra lá bài đối thủ
  const oppCardIdx = opponent.hand.findIndex((c) => c.instanceId === target.targetCardInstanceId);
  if (oppCardIdx === -1) throw new Error("Đối thủ không sở hữu lá bài chỉ định.");
  const oppCard = opponent.hand.splice(oppCardIdx, 1)[0]!;

  // 4. Xác nhận quy luật tương khắc
  if (KE_CYCLE[myCard.element] !== oppCard.element) {
    throw new Error(`Hành ${myCard.element} không khắc hành ${oppCard.element}.`);
  }

  // Đưa cả 2 lá vào cọc bỏ
  next.discard.push(myCard, oppCard);
  next.log.push(
    `${player.name} dùng Phá âm: Bỏ ${myCard.name} (${myCard.element}) ép ${opponent.name} bỏ ${oppCard.name} (${oppCard.element}).`
  );

  return finishTurn(next);
}
