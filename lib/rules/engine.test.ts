/**
 * ==============================================================================
 * FILE: lib/rules/engine.test.ts
 * MỤC ĐÍCH: Kiểm thử toàn diện Lõi luật Ngũ Cung và mô phỏng 1,000 ván đấu bot
 * ==============================================================================
 */

import { describe, it, expect } from "vitest";
import {
  buildDeck,
  createGame,
  pickFromMarket,
  presentCombo,
  breakSound,
  findCombos,
  getBreakSoundOptions,
  getCurrentPlayer,
  HAND_LIMIT,
  WIN_THRESHOLD,
  SHENG_CYCLE,
  KE_CYCLE,
} from "./engine";
import { decideBotMove, executeBotTurn } from "./bot";
import { CardInstance, ComboResult } from "./types";

describe("Ngũ Cung Rules Engine", () => {
  it("khởi tạo bộ bài chuẩn 45 lá (15 nhạc cụ x 3 bản sao)", () => {
    const deck = buildDeck();
    expect(deck).toHaveLength(45);

    // Kiểm tra đủ 5 hành, mỗi hành 9 lá
    const counts: Record<string, number> = {};
    for (const card of deck) {
      counts[card.element] = (counts[card.element] ?? 0) + 1;
    }
    expect(counts["tho"]).toBe(9);
    expect(counts["kim"]).toBe(9);
    expect(counts["moc"]).toBe(9);
    expect(counts["hoa"]).toBe(9);
    expect(counts["thuy"]).toBe(9);
  });

  it("khởi tạo ván chơi 2 người: mỗi người 5 lá, chợ nhạc 5 lá, cọc rút 30 lá", () => {
    const game = createGame({ playerCount: 2, seed: 12345 });
    expect(game.players).toHaveLength(2);
    expect(game.players[0]!.hand).toHaveLength(5);
    expect(game.players[1]!.hand).toHaveLength(5);
    expect(game.market).toHaveLength(5);
    expect(game.deck).toHaveLength(30);
    expect(game.discard).toHaveLength(0);
    expect(game.currentPlayerIndex).toBe(0);
    expect(game.over).toBe(false);
  });

  it("hành động Chọn nhạc cụ từ Chợ: thêm vào tay, bù cọc chợ, chuyển lượt", () => {
    let game = createGame({ playerCount: 2, seed: 42 });
    const marketCard = game.market[0]!;
    game = pickFromMarket(game, 0);

    // Người 1 (index 0 trước đó) giờ có 6 lá
    expect(game.players[0]!.hand).toHaveLength(6);
    expect(game.players[0]!.hand.some((c) => c.instanceId === marketCard.instanceId)).toBe(true);
    // Chợ được bù đủ 5 lá
    expect(game.market).toHaveLength(5);
    // Chuyển lượt sang Người 2
    expect(game.currentPlayerIndex).toBe(1);
  });

  it("không cho phép chọn từ Chợ khi tay đã đạt 7 lá", () => {
    let game = createGame({ playerCount: 2, seed: 99 });
    // Bổ sung cho người 0 đủ 7 lá
    while (game.players[0]!.hand.length < HAND_LIMIT) {
      game.players[0]!.hand.push(game.deck.pop()!);
    }
    expect(game.players[0]!.hand).toHaveLength(7);
    expect(() => pickFromMarket(game, 0)).toThrow("Tay đã đạt giới hạn 7 lá");
  });

  it("nhận diện chuẩn 4 loại Combo", () => {
    // 1. Combo Ngũ Cung: 5 lá 5 hành
    const nguCungHand: CardInstance[] = [
      { instanceId: "1", instrumentId: "dan-da", name: "Đàn đá", element: "tho" },
      { instanceId: "2", instrumentId: "trong-dong", name: "Trống đồng", element: "kim" },
      { instanceId: "3", instrumentId: "sao-truc", name: "Sáo trúc", element: "moc" },
      { instanceId: "4", instrumentId: "ken-bau", name: "Kèn bầu", element: "hoa" },
      { instanceId: "5", instrumentId: "dan-bau", name: "Đàn bầu", element: "thuy" },
    ];
    const combosNguCung = findCombos(nguCungHand);
    expect(combosNguCung.some((c) => c.kind === "ngu-cung" && c.score === 8)).toBe(true);

    // 2. Hợp tấu: 3 lá cùng hành, 3 nhạc cụ KHÁC NHAU
    const hopTauHand: CardInstance[] = [
      { instanceId: "1", instrumentId: "dan-da", name: "Đàn đá", element: "tho" },
      { instanceId: "2", instrumentId: "trong-com", name: "Trống cơm", element: "tho" },
      { instanceId: "3", instrumentId: "tu-va", name: "Tù và", element: "tho" },
    ];
    const combosHopTau = findCombos(hopTauHand);
    expect(combosHopTau.some((c) => c.kind === "hop-tau" && c.score === 4)).toBe(true);

    // 3. Đồng âm: 3 lá cùng hành, có nhạc cụ TRÙNG NHAU
    const dongAmHand: CardInstance[] = [
      { instanceId: "1", instrumentId: "dan-da", name: "Đàn đá", element: "tho" },
      { instanceId: "2", instrumentId: "dan-da", name: "Đàn đá", element: "tho" },
      { instanceId: "3", instrumentId: "trong-com", name: "Trống cơm", element: "tho" },
    ];
    const combosDongAm = findCombos(dongAmHand);
    expect(combosDongAm.some((c) => c.kind === "dong-am" && c.score === 2)).toBe(true);

    // 4. Liên hoàn: cặp Mộc -> Hỏa (đúng chiều tương sinh)
    const lienHoanHand: CardInstance[] = [
      { instanceId: "1", instrumentId: "sao-truc", name: "Sáo trúc", element: "moc" },
      { instanceId: "2", instrumentId: "ken-bau", name: "Kèn bầu", element: "hoa" },
    ];
    const combosLienHoan = findCombos(lienHoanHand);
    expect(combosLienHoan.some((c) => c.kind === "lien-hoan" && c.score === 2)).toBe(true);

    // Hai hành không tương sinh (Hỏa và Thủy) KHÔNG tạo thành liên hoàn
    const hoaVaThuy = findCombos([
      { instanceId: "1", instrumentId: "ken-bau", name: "Kèn bầu", element: "hoa" },
      { instanceId: "2", instrumentId: "dan-bau", name: "Đàn bầu", element: "thuy" },
    ]);
    expect(hoaVaThuy.length).toBe(0);
  });

  it("trình tấu Liên hoàn: cộng 2 điểm và rút thêm 1 lá từ Chợ Nhạc", () => {
    let game = createGame({ playerCount: 2, seed: 777 });
    const c1: CardInstance = { instanceId: "c1", instrumentId: "sao-truc", name: "Sáo trúc", element: "moc" };
    const c2: CardInstance = { instanceId: "c2", instrumentId: "ken-bau", name: "Kèn bầu", element: "hoa" };
    game.players[0]!.hand = [c1, c2];

    const combo: ComboResult = { kind: "lien-hoan", cards: [c1, c2], score: 2 };
    game = presentCombo(game, combo, 0);

    // Điểm Người 1 tăng 2
    expect(game.players[0]!.score).toBe(2);
    // Nhận thêm 1 lá từ Chợ
    expect(game.players[0]!.hand).toHaveLength(1);
    // Chợ vẫn được bù đủ 5 lá
    expect(game.market).toHaveLength(5);
  });

  it("hành động Phá âm: chỉ hợp lệ khi đối thủ có hành bị khắc", () => {
    let game = createGame({ playerCount: 2, seed: 888 });
    const mocCard: CardInstance = { instanceId: "m1", instrumentId: "sao-truc", name: "Sáo trúc", element: "moc" };
    const thoCard: CardInstance = { instanceId: "t1", instrumentId: "dan-da", name: "Đàn đá", element: "tho" };
    const kimCard: CardInstance = { instanceId: "k1", instrumentId: "cong-chieng", name: "Cồng chiêng", element: "kim" };

    game.players[0]!.hand = [mocCard];
    game.players[1]!.hand = [thoCard]; // Mộc khắc Thổ -> hợp lệ

    const opts = getBreakSoundOptions(game);
    expect(opts).toHaveLength(1);
    expect(opts[0]!.actingCardInstanceId).toBe("m1");
    expect(opts[0]!.targetPlayerId).toBe("p1");
    expect(opts[0]!.targetCardInstanceId).toBe("t1");

    // Thực thi Phá âm
    game = breakSound(game, opts[0]!);
    expect(game.players[0]!.hand).toHaveLength(0);
    expect(game.players[1]!.hand).toHaveLength(0);
    expect(game.discard).toHaveLength(2);

    // Trường hợp không ai có hành bị khắc
    game.players[1]!.hand = [kimCard]; // Mộc không khắc Kim
    const invalidOpts = getBreakSoundOptions(game);
    expect(invalidOpts).toHaveLength(0);
  });

  it("phân định hòa (Tiebreak) bằng số lần Hợp tấu khi cùng đạt điểm cao nhất", () => {
    let game = createGame({ playerCount: 2, seed: 100 });
    // Người 0: 15đ, 2 lần Hợp tấu
    game.players[0]!.score = 15;
    game.players[0]!.hopTauCount = 2;
    // Người 1: 15đ, 1 lần Hợp tấu
    game.players[1]!.score = 15;
    game.players[1]!.hopTauCount = 1;

    // Giả lập kích hoạt vòng cuối kết thúc
    game.endRoundTriggeredBy = "p0";
    game.turnsRemainingInFinalRound = 1;
    // Kết thúc lượt người 0
    game = pickFromMarket(game, 0);

    expect(game.over).toBe(true);
    // Người 0 thắng nhờ có 2 lần Hợp tấu so với 1 của Người 1
    expect(game.winnerId).toBe("p0");
  });
});

describe("Mô phỏng 1,000 ván đấu Bot AI (Zero Illegal Moves Assertion)", () => {
  it("chạy 1,000 ván đấu tự động không bao giờ gặp lỗi luật hay vòng lặp vô tận", () => {
    const totalGames = 1000;
    const playerCounts = [2, 3, 4, 5];

    let completedGames = 0;

    for (let i = 0; i < totalGames; i++) {
      const playerCount = playerCounts[i % playerCounts.length]!;
      let game = createGame({
        playerCount: 0,
        botCount: playerCount,
        seed: 1000 + i,
      });

      let turnCount = 0;
      const MAX_TURNS = 300; // Bảo đảm ván đấu có đủ lượt cho 5 người chơi và không lặp vô tận

      while (!game.over && turnCount < MAX_TURNS) {
        turnCount++;
        const currentPlayer = getCurrentPlayer(game);
        expect(currentPlayer.isBot).toBe(true);

        const beforeHandLen = currentPlayer.hand.length;
        const beforeScore = currentPlayer.score;

        // Bot ra quyết định
        const decision = decideBotMove(game);
        expect(["present", "break-sound", "pick-market"]).toContain(decision.action);

        // Thực thi lượt
        game = executeBotTurn(game);

        // Kiểm tra sau lượt: tay người chơi không vượt quá 7 lá
        for (const p of game.players) {
          expect(p.hand.length).toBeLessThanOrEqual(HAND_LIMIT);
        }
      }

      expect(game.over).toBe(true);
      expect(game.winnerId).not.toBeNull();
      completedGames++;
    }

    expect(completedGames).toBe(totalGames);
  }, 30000);
});
