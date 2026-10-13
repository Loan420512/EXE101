/**
 * ==============================================================================
 * FILE: server/realtime.js
 * MỤC ĐÍCH: Máy chủ WebSocket độc lập cho chế độ chơi Online Phòng Riêng Ngũ Cung
 * TÍNH NĂNG:
 * - Cổng mặc định: 4000 (hoặc process.env.PORT)
 * - Quản lý phòng chơi bằng mã 4 ký tự (A-Z, 0-9)
 * - Server-Authoritative: Quản lý ván đấu an toàn, chống gian lận
 * - Hỗ trợ 2 đến 5 người chơi
 * - Tự động Reconnect qua playerId & sessionToken
 * - Bot thông minh thay thế khi người chơi mất kết nối quá thời gian
 * - HTTP endpoint GET /health cho Docker healthcheck & kiểm tra trạng thái
 * ==============================================================================
 */

const http = require("http");
const { WebSocketServer, WebSocket } = require("ws");

const PORT = process.env.PORT || 4000;

// ==============================================================================
// 1. LÕI LUẬT NGŨ CUNG SERVER-SIDE (AUTHORITATIVE)
// ==============================================================================
const HAND_LIMIT = 7;
const WIN_THRESHOLD = 15;
const START_HAND_SIZE = 5;
const MARKET_SIZE = 5;

const INSTRUMENTS = [
  { id: "dan-da", name: "Đàn đá", element: "tho" },
  { id: "trong-com", name: "Trống cơm", element: "tho" },
  { id: "tu-va", name: "Tù và", element: "tho" },
  { id: "cong-chieng", name: "Cồng chiêng", element: "kim" },
  { id: "trong-dong", name: "Trống đồng", element: "kim" },
  { id: "thanh-la", name: "Thanh la", element: "kim" },
  { id: "dan-trung", name: "Đàn t'rưng", element: "moc" },
  { id: "sao-truc", name: "Sáo trúc", element: "moc" },
  { id: "phach", name: "Phách", element: "moc" },
  { id: "ken-bau", name: "Kèn bầu", element: "hoa" },
  { id: "trong-chau", name: "Trống chầu", element: "hoa" },
  { id: "dan-ty-ba", name: "Đàn tỳ bà", element: "hoa" },
  { id: "dan-bau", name: "Đàn bầu", element: "thuy" },
  { id: "dan-tranh", name: "Đàn tranh", element: "thuy" },
  { id: "dan-nhi", name: "Đàn nhị", element: "thuy" },
];

const SHENG_CYCLE = {
  moc: "hoa",
  hoa: "tho",
  tho: "kim",
  kim: "thuy",
  thuy: "moc",
};

const KE_CYCLE = {
  moc: "tho",
  tho: "thuy",
  thuy: "hoa",
  hoa: "kim",
  kim: "moc",
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const cards = [];
  for (const inst of INSTRUMENTS) {
    for (let c = 0; c < 3; c++) {
      cards.push({
        instanceId: `${inst.id}-${c}-${Math.random().toString(36).substring(2, 6)}`,
        instrumentId: inst.id,
        name: inst.name,
        element: inst.element,
      });
    }
  }
  return shuffle(cards);
}

function createAuthoritativeGame(playersConfig) {
  const deck = buildDeck();
  const players = playersConfig.map((cfg, idx) => ({
    id: cfg.id,
    name: cfg.name,
    isBot: Boolean(cfg.isBot),
    hand: [],
    score: 0,
    hopTauCount: 0,
  }));

  // Chia 5 lá mỗi người
  for (let round = 0; round < START_HAND_SIZE; round++) {
    for (const p of players) {
      if (deck.length > 0) p.hand.push(deck.pop());
    }
  }

  // Chia 5 lá Chợ
  const market = [];
  while (market.length < MARKET_SIZE && deck.length > 0) {
    market.push(deck.pop());
  }

  return {
    deck,
    market,
    discard: [],
    players,
    currentPlayerIndex: 0,
    endRoundTriggeredBy: null,
    turnsRemainingInFinalRound: -1,
    winnerId: null,
    log: ["Trận đấu trực tuyến bắt đầu! Chợ Nhạc có 5 lá."],
    over: false,
  };
}

function ensureRefillMarket(game) {
  while (game.market.length < MARKET_SIZE) {
    if (game.deck.length === 0) {
      if (game.discard.length === 0) break;
      game.deck = shuffle(game.discard);
      game.discard = [];
      game.log.push("Cọc rút hết bài: Đã xáo cọc bỏ làm cọc rút mới.");
    }
    const card = game.deck.pop();
    if (card) game.market.push(card);
  }
}

function finishTurn(game) {
  const active = game.players[game.currentPlayerIndex];
  while (active.hand.length > HAND_LIMIT) {
    const card = active.hand.pop();
    game.discard.push(card);
    game.log.push(`${active.name} bỏ ${card.name} vì tay vượt quá 7 lá.`);
  }

  if (game.deck.length === 0 && game.discard.length === 0) {
    game.over = true;
    determineWinner(game);
    return game;
  }

  if (game.endRoundTriggeredBy) {
    game.turnsRemainingInFinalRound -= 1;
    if (game.turnsRemainingInFinalRound <= 0) {
      game.over = true;
      determineWinner(game);
      return game;
    }
  }

  game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
  return game;
}

function determineWinner(game) {
  const sorted = [...game.players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.hopTauCount - a.hopTauCount;
  });
  game.winnerId = sorted[0]?.id || null;
  game.log.push(`Trận đấu kết thúc! Người chiến thắng là: ${sorted[0]?.name}`);
}

function findServerCombos(hand) {
  const combos = [];
  const byElement = {};
  for (const c of hand) {
    if (!byElement[c.element]) byElement[c.element] = [];
    byElement[c.element].push(c);
  }

  // 1. Ngũ Cung (8đ)
  const elements = Object.keys(byElement);
  if (elements.length === 5) {
    const cards = elements.map((el) => byElement[el][0]);
    combos.push({ kind: "ngu-cung", cards, score: 8 });
  }

  // 2. Hợp tấu (4đ) & Đồng âm (2đ)
  for (const el of elements) {
    const group = byElement[el];
    if (group.length >= 3) {
      for (let i = 0; i < group.length - 2; i++) {
        for (let j = i + 1; j < group.length - 1; j++) {
          for (let k = j + 1; k < group.length; k++) {
            const triple = [group[i], group[j], group[k]];
            const unique = new Set(triple.map((c) => c.instrumentId));
            if (unique.size === 3) {
              combos.push({ kind: "hop-tau", cards: triple, score: 4 });
            } else {
              combos.push({ kind: "dong-am", cards: triple, score: 2 });
            }
          }
        }
      }
    }
  }

  // 3. Liên hoàn (2đ)
  for (let i = 0; i < hand.length; i++) {
    for (let j = 0; j < hand.length; j++) {
      if (i === j) continue;
      const a = hand[i];
      const b = hand[j];
      if (SHENG_CYCLE[a.element] === b.element) {
        combos.push({ kind: "lien-hoan", cards: [a, b], score: 2 });
      }
    }
  }

  combos.sort((a, b) => b.score - a.score);
  return combos;
}

function executeServerBotTurn(game) {
  const current = game.players[game.currentPlayerIndex];
  if (!current.isBot || game.over) return;

  const combos = findServerCombos(current.hand);
  const canPick = current.hand.length < HAND_LIMIT && game.market.length > 0;

  // Combo đạt 15đ thắng
  const winCombo = combos.find((c) => current.score + c.score >= WIN_THRESHOLD);
  if (winCombo) {
    return applyPresentCombo(game, current.id, winCombo);
  }

  // Combo điểm cao (8đ hoặc 4đ)
  const highCombo = combos.find((c) => c.kind === "ngu-cung" || c.kind === "hop-tau");
  if (highCombo) {
    return applyPresentCombo(game, current.id, highCombo);
  }

  // Nếu có combo và tay >= 4 lá
  if (combos.length > 0 && current.hand.length >= 4) {
    return applyPresentCombo(game, current.id, combos[0]);
  }

  // Nhặt chợ nếu được
  if (canPick) {
    return applyPickMarket(game, current.id, 0);
  }

  // Trình tấu nếu còn combo
  if (combos.length > 0) {
    return applyPresentCombo(game, current.id, combos[0]);
  }
}

function applyPickMarket(game, playerId, marketIndex) {
  const current = game.players[game.currentPlayerIndex];
  if (current.id !== playerId) throw new Error("Chưa tới lượt của bạn.");
  if (current.hand.length >= HAND_LIMIT) throw new Error("Tay đã đạt 7 lá.");
  if (marketIndex < 0 || marketIndex >= game.market.length) throw new Error("Vị trí chợ sai.");

  const card = game.market.splice(marketIndex, 1)[0];
  current.hand.push(card);
  ensureRefillMarket(game);
  game.log.push(`${current.name} chọn ${card.name} (${card.element.toUpperCase()}) từ Chợ.`);

  return finishTurn(game);
}

function applyPresentCombo(game, playerId, combo) {
  const current = game.players[game.currentPlayerIndex];
  if (current.id !== playerId) throw new Error("Chưa tới lượt của bạn.");

  const playedIds = new Set(combo.cards.map((c) => c.instanceId));
  const remaining = current.hand.filter((c) => !playedIds.has(c.instanceId));
  if (current.hand.length - remaining.length !== combo.cards.length) {
    throw new Error("Lá bài không hợp lệ.");
  }

  current.hand = remaining;
  game.discard.push(...combo.cards);
  current.score += combo.score;
  if (combo.kind === "hop-tau") current.hopTauCount += 1;

  game.log.push(`${current.name} trình tấu ${combo.kind.toUpperCase()} (+${combo.score}đ).`);

  if (combo.kind === "lien-hoan" && game.market.length > 0 && current.hand.length < HAND_LIMIT) {
    const extra = game.market.splice(0, 1)[0];
    if (extra) {
      current.hand.push(extra);
      ensureRefillMarket(game);
      game.log.push(`${current.name} nhận thêm ${extra.name} từ Chợ nhờ Liên hoàn.`);
    }
  }

  if (!game.endRoundTriggeredBy && current.score >= WIN_THRESHOLD) {
    game.endRoundTriggeredBy = current.id;
    game.turnsRemainingInFinalRound = game.players.length - 1;
    game.log.push(`${current.name} đạt ${current.score}đ! Kích hoạt vòng cuối.`);
  }

  return finishTurn(game);
}

function applyBreakSound(game, playerId, target) {
  const current = game.players[game.currentPlayerIndex];
  if (current.id !== playerId) throw new Error("Chưa tới lượt của bạn.");

  const myIdx = current.hand.findIndex((c) => c.instanceId === target.actingCardInstanceId);
  if (myIdx === -1) throw new Error("Lá của bạn không hợp lệ.");
  const myCard = current.hand.splice(myIdx, 1)[0];

  const opp = game.players.find((p) => p.id === target.targetPlayerId);
  if (!opp || opp.id === current.id) throw new Error("Đối thủ không hợp lệ.");

  const oppIdx = opp.hand.findIndex((c) => c.instanceId === target.targetCardInstanceId);
  if (oppIdx === -1) throw new Error("Đối thủ không có lá bài này.");
  const oppCard = opp.hand.splice(oppIdx, 1)[0];

  if (KE_CYCLE[myCard.element] !== oppCard.element) {
    throw new Error("Hai hành này không tương khắc.");
  }

  game.discard.push(myCard, oppCard);
  game.log.push(
    `${current.name} Phá âm: Bỏ ${myCard.name} ép ${opp.name} bỏ ${oppCard.name}.`
  );

  return finishTurn(game);
}

// ==============================================================================
// 2. MÁY CHỦ HTTP & WEBSOCKET
// ==============================================================================
const rooms = new Map(); // roomCode -> Room Object

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "Ngũ Cung Realtime Multiplayer",
        roomsCount: rooms.size,
        uptime: process.uptime(),
      })
    );
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

function broadcastRoom(room, data) {
  const payload = JSON.stringify(data);
  for (const client of room.clients.values()) {
    if (client.ws && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  }
}

function sanitizeGameStateForPlayer(game, playerId) {
  if (!game) return null;
  // Giấu bài của đối thủ, chỉ hiển thị số lượng lá bài
  return {
    ...game,
    deckCount: game.deck.length,
    deck: undefined, // giấu cọc rút
    players: game.players.map((p) => ({
      ...p,
      hand: p.id === playerId ? p.hand : p.hand.map((c) => ({ instanceId: c.instanceId, isHidden: true })),
    })),
  };
}

function broadcastGameState(room) {
  if (!room.game) return;
  for (const [pId, client] of room.clients.entries()) {
    if (client.ws && client.ws.readyState === WebSocket.OPEN) {
      const sanitized = sanitizeGameStateForPlayer(room.game, pId);
      client.ws.send(
        JSON.stringify({
          type: "GAME_STATE_UPDATE",
          game: sanitized,
          roomCode: room.code,
        })
      );
    }
  }

  // Tự động kiểm tra và chạy lượt Bot nếu người chơi tiếp theo là Bot
  checkAndTriggerBotTurn(room);
}

function checkAndTriggerBotTurn(room) {
  if (!room.game || room.game.over) return;
  const current = room.game.players[room.game.currentPlayerIndex];
  if (current && current.isBot) {
    setTimeout(() => {
      if (room.game && !room.game.over) {
        executeServerBotTurn(room.game);
        broadcastGameState(room);
      }
    }, 900);
  }
}

wss.on("connection", (ws) => {
  let clientSession = null;

  ws.on("message", (msgStr) => {
    try {
      const msg = JSON.parse(msgStr);
      switch (msg.type) {
        case "CREATE_ROOM": {
          const roomCode = generateRoomCode();
          const playerId = `player_${Math.random().toString(36).substring(2, 8)}`;
          const token = `token_${Math.random().toString(36).substring(2, 10)}`;

          const room = {
            code: roomCode,
            hostId: playerId,
            maxPlayers: msg.maxPlayers || 4,
            clients: new Map(), // playerId -> { ws, name, token, isBot }
            game: null,
          };

          room.clients.set(playerId, {
            ws,
            name: msg.name || "Chủ phòng",
            token,
            isBot: false,
          });

          rooms.set(roomCode, room);
          clientSession = { roomCode, playerId, token };

          ws.send(
            JSON.stringify({
              type: "ROOM_CREATED",
              roomCode,
              playerId,
              token,
              isHost: true,
              players: [{ id: playerId, name: msg.name || "Chủ phòng", isHost: true }],
            })
          );
          break;
        }

        case "JOIN_ROOM": {
          const roomCode = (msg.roomCode || "").toUpperCase();
          const room = rooms.get(roomCode);
          if (!room) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Phòng không tồn tại." }));
            return;
          }
          if (room.game && !room.game.over) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Trận đấu trong phòng đã bắt đầu." }));
            return;
          }
          if (room.clients.size >= room.maxPlayers) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Phòng đã đủ số lượng người chơi." }));
            return;
          }

          const playerId = `player_${Math.random().toString(36).substring(2, 8)}`;
          const token = `token_${Math.random().toString(36).substring(2, 10)}`;

          room.clients.set(playerId, {
            ws,
            name: msg.name || `Người chơi ${room.clients.size + 1}`,
            token,
            isBot: false,
          });

          clientSession = { roomCode, playerId, token };

          ws.send(
            JSON.stringify({
              type: "ROOM_JOINED",
              roomCode,
              playerId,
              token,
              isHost: false,
            })
          );

          // Cập nhật danh sách phòng cho tất cả
          const playerList = Array.from(room.clients.entries()).map(([id, c]) => ({
            id,
            name: c.name,
            isHost: id === room.hostId,
          }));
          broadcastRoom(room, { type: "ROOM_PLAYERS_UPDATE", players: playerList });
          break;
        }

        case "RECONNECT": {
          const { roomCode, playerId, token } = msg;
          const room = rooms.get(roomCode);
          if (!room) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Phòng không còn tồn tại." }));
            return;
          }
          const client = room.clients.get(playerId);
          if (!client || client.token !== token) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Phiên kết nối không hợp lệ." }));
            return;
          }

          // Cập nhật lại kết nối WebSocket mới
          client.ws = ws;
          clientSession = { roomCode, playerId, token };

          ws.send(
            JSON.stringify({
              type: "RECONNECTED",
              roomCode,
              playerId,
              isHost: playerId === room.hostId,
            })
          );

          if (room.game) {
            ws.send(
              JSON.stringify({
                type: "GAME_STATE_UPDATE",
                game: sanitizeGameStateForPlayer(room.game, playerId),
                roomCode: room.code,
              })
            );
          }
          break;
        }

        case "START_GAME": {
          if (!clientSession) return;
          const room = rooms.get(clientSession.roomCode);
          if (!room || room.hostId !== clientSession.playerId) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Chỉ chủ phòng mới có quyền bắt đầu ván." }));
            return;
          }

          // Chuẩn bị danh sách người chơi, nếu thiếu tự động thêm Bot cho đủ 2-5
          const playerConfigs = Array.from(room.clients.entries()).map(([id, c]) => ({
            id,
            name: c.name,
            isBot: c.isBot,
          }));

          // Nếu chỉ có 1 người, thêm 1 Bot
          if (playerConfigs.length < 2) {
            const botId = `bot_${Math.random().toString(36).substring(2, 6)}`;
            playerConfigs.push({ id: botId, name: "Máy Dân Gian", isBot: true });
          }

          room.game = createAuthoritativeGame(playerConfigs);
          broadcastGameState(room);
          break;
        }

        case "ACTION_PICK_MARKET": {
          if (!clientSession) return;
          const room = rooms.get(clientSession.roomCode);
          if (!room || !room.game) return;

          applyPickMarket(room.game, clientSession.playerId, msg.marketIndex);
          broadcastGameState(room);
          break;
        }

        case "ACTION_PRESENT_COMBO": {
          if (!clientSession) return;
          const room = rooms.get(clientSession.roomCode);
          if (!room || !room.game) return;

          applyPresentCombo(room.game, clientSession.playerId, msg.combo);
          broadcastGameState(room);
          break;
        }

        case "ACTION_BREAK_SOUND": {
          if (!clientSession) return;
          const room = rooms.get(clientSession.roomCode);
          if (!room || !room.game) return;

          applyBreakSound(room.game, clientSession.playerId, msg.target);
          broadcastGameState(room);
          break;
        }
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: "ERROR", message: e.message || "Lỗi xử lý yêu cầu." }));
    }
  });

  ws.on("close", () => {
    if (clientSession) {
      const room = rooms.get(clientSession.roomCode);
      if (room && room.game && !room.game.over) {
        // Nếu người chơi thoát giữa ván, chuyển thành Bot sau 10 giây nếu không kết nối lại
        setTimeout(() => {
          const client = room.clients.get(clientSession.playerId);
          if (client && (!client.ws || client.ws.readyState !== WebSocket.OPEN)) {
            client.isBot = true;
            const inGamePlayer = room.game.players.find((p) => p.id === clientSession.playerId);
            if (inGamePlayer) {
              inGamePlayer.isBot = true;
              inGamePlayer.name = `${inGamePlayer.name} (Máy tiếp quản)`;
              room.game.log.push(`${inGamePlayer.name} mất kết nối: Máy AI đã tiếp quản lượt chơi.`);
              broadcastGameState(room);
            }
          }
        }, 10000);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Ngũ Cung Realtime Server] Đang lắng nghe tại cổng ${PORT} (ws://localhost:${PORT})`);
});
