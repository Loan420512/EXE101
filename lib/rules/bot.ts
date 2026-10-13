/**
 * ==============================================================================
 * FILE: lib/rules/bot.ts
 * MỤC ĐÍCH: Trí tuệ nhân tạo (Bot Heuristic AI) cho Ngũ Cung
 * - Không bao giờ phạm luật (Zero illegal moves).
 * - Chiến lược:
 *   1. Trình tấu nếu có Ngũ Cung (8đ) hoặc Hợp tấu (4đ) hoặc khi đạt mốc thắng (>=15đ).
 *   2. Phá âm nếu đối thủ dẫn điểm sắp thắng (score >= 10) để cản bước.
 *   3. Chọn lá Chợ Nhạc có ích nhất (bổ sung hành còn thiếu cho Ngũ Cung hoặc ghép bộ 3).
 *   4. Nếu tay đầy (>= 7 lá) hoặc còn combo: Trình tấu tổ hợp tốt nhất.
 * ==============================================================================
 */

import {
  GameState,
  ComboResult,
  BreakSoundTarget,
} from "./types";
import {
  HAND_LIMIT,
  WIN_THRESHOLD,
  getCurrentPlayer,
  findCombos,
  getBreakSoundOptions,
  pickFromMarket,
  presentCombo,
  breakSound,
} from "./engine";

export type BotDecision =
  | { action: "present"; combo: ComboResult; extraMarketIndex?: number }
  | { action: "break-sound"; target: BreakSoundTarget }
  | { action: "pick-market"; marketIndex: number };

export function decideBotMove(state: GameState): BotDecision {
  if (state.over) {
    throw new Error("Không thể ra quyết định khi ván đấu đã kết thúc.");
  }

  const me = getCurrentPlayer(state);
  const combos = findCombos(me.hand);
  const breakOptions = getBreakSoundOptions(state);
  const canPickMarket = me.hand.length < HAND_LIMIT && state.market.length > 0;

  // 1. Kiểm tra nếu có combo lập tức đưa điểm tới >= 15 (thắng ngay)
  const winningCombo = combos.find((c) => me.score + c.score >= WIN_THRESHOLD);
  if (winningCombo) {
    return { action: "present", combo: winningCombo, extraMarketIndex: 0 };
  }

  // 2. Ưu tiên tổ hợp điểm cao: Ngũ Cung (8đ) hoặc Hợp tấu (4đ)
  const highTierCombo = combos.find((c) => c.kind === "ngu-cung" || c.kind === "hop-tau");
  if (highTierCombo) {
    return { action: "present", combo: highTierCombo, extraMarketIndex: 0 };
  }

  // 3. Nếu có tổ hợp điểm bất kỳ (Đồng âm, Liên hoàn) và tay khá đầy: Trình tấu lấy điểm để đua thắng
  if (combos.length > 0 && me.hand.length >= 4) {
    return { action: "present", combo: combos[0]!, extraMarketIndex: 0 };
  }

  // 4. Phá âm cản bước đối thủ: Khi đối thủ sắp chạm mốc 15 (score >= 13)
  if (breakOptions.length > 0 && me.hand.length >= 2) {
    const criticalOpponents = state.players
      .filter((p) => p.id !== me.id && p.score >= 13)
      .sort((a, b) => b.score - a.score);

    if (criticalOpponents.length > 0) {
      const topTargetId = criticalOpponents[0]!.id;
      const targetOption = breakOptions.find((opt) => opt.targetPlayerId === topTargetId);
      if (targetOption) {
        return { action: "break-sound", target: targetOption };
      }
    }
  }

  // 4. Nếu tay đầy hoặc có combo tốt (hoặc tay >= 5 lá có combo): Trình tấu để tăng điểm
  if (combos.length > 0 && (me.hand.length >= 5 || !canPickMarket)) {
    return { action: "present", combo: combos[0]!, extraMarketIndex: 0 };
  }

  // 5. Nếu có thể nhặt Chợ: Ưu tiên xây dựng bài
  if (canPickMarket) {
    const myElements = new Set(me.hand.map((c) => c.element));
    let bestMarketIndex = 0;
    let bestScore = -1;

    state.market.forEach((card, idx) => {
      let score = 0;
      // Bổ sung hành mới (hướng tới Ngũ Cung): +3
      if (!myElements.has(card.element)) score += 3;
      // Ghép bộ 3 (Hợp tấu hoặc Đồng âm): +4
      const sameElementCount = me.hand.filter((c) => c.element === card.element).length;
      if (sameElementCount === 2) score += 4;
      else if (sameElementCount === 1) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestMarketIndex = idx;
      }
    });

    return { action: "pick-market", marketIndex: bestMarketIndex };
  }

  // 6. Nếu còn bất kỳ combo nào: Trình tấu
  if (combos.length > 0) {
    return { action: "present", combo: combos[0]!, extraMarketIndex: 0 };
  }

  // 7. Phá âm nếu không còn cách nào khác và có phương án hợp lệ
  if (breakOptions.length > 0) {
    return { action: "break-sound", target: breakOptions[0]! };
  }

  // 8. Dự phòng: Nếu có thể nhặt Chợ
  if (canPickMarket) {
    return { action: "pick-market", marketIndex: 0 };
  }

  // Dự phòng cuối: Nếu tay đầy và không có combo lớn (rất hiếm theo định lý đồ thị), trình tấu combo đầu
  if (combos.length > 0) {
    return { action: "present", combo: combos[0]!, extraMarketIndex: 0 };
  }

  throw new Error("Không tìm thấy nước đi hợp lệ cho Bot.");
}

export function executeBotTurn(state: GameState): GameState {
  const decision = decideBotMove(state);
  switch (decision.action) {
    case "present":
      return presentCombo(state, decision.combo, decision.extraMarketIndex ?? 0);
    case "break-sound":
      return breakSound(state, decision.target);
    case "pick-market":
      return pickFromMarket(state, decision.marketIndex);
  }
}
