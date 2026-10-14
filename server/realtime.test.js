import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { WebSocket } from "ws";
import { fork } from "child_process";
import path from "path";

function waitForType(ws, targetType) {
  return new Promise((resolve, reject) => {
    const onMessage = (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === targetType) {
          ws.off("message", onMessage);
          ws.off("error", onError);
          resolve(msg);
        }
      } catch (e) {
        reject(e);
      }
    };
    const onError = (err) => {
      ws.off("message", onMessage);
      reject(err);
    };
    ws.on("message", onMessage);
    ws.once("error", onError);
  });
}

describe("WebSocket Realtime Multiplayer (M6)", () => {
  let serverProcess = null;

  beforeAll(async () => {
    const checkServer = () =>
      new Promise((res) => {
        const ws = new WebSocket("ws://localhost:4000");
        ws.once("open", () => {
          ws.close();
          res(true);
        });
        ws.once("error", () => res(false));
      });

    const isAlreadyRunning = await checkServer();
    if (!isAlreadyRunning) {
      serverProcess = fork(path.resolve(process.cwd(), "server/realtime.js"), [], {
        stdio: "ignore",
      });
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 150));
        if (await checkServer()) break;
      }
    }
  }, 10000);

  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it("hai người chơi kết nối, tạo phòng, bắt đầu ván, đi nước và khôi phục khi reconnect", async () => {
    const WS_URL = "ws://localhost:4000";

    // 1. Client 1 (Chủ phòng) tạo phòng
    const ws1 = new WebSocket(WS_URL);
    await new Promise((res) => ws1.once("open", res));

    ws1.send(JSON.stringify({ type: "CREATE_ROOM", name: "Nguyễn Văn A" }));
    const res1 = await waitForType(ws1, "ROOM_CREATED");
    expect(res1.type).toBe("ROOM_CREATED");
    expect(res1.roomCode).toHaveLength(4);

    const roomCode = res1.roomCode;
    const p1Token = res1.token;
    const p1Id = res1.playerId;

    // 2. Client 2 (Khách) vào phòng
    const ws2 = new WebSocket(WS_URL);
    await new Promise((res) => ws2.once("open", res));

    ws2.send(JSON.stringify({ type: "JOIN_ROOM", roomCode, name: "Trần Thị B" }));
    const res2 = await waitForType(ws2, "ROOM_JOINED");
    expect(res2.type).toBe("ROOM_JOINED");

    const p2Token = res2.token;
    const p2Id = res2.playerId;

    // Đọc tin nhắn cập nhật người chơi cho Client 1
    const update1 = await waitForType(ws1, "ROOM_PLAYERS_UPDATE");
    expect(update1.type).toBe("ROOM_PLAYERS_UPDATE");
    expect(update1.players).toHaveLength(2);

    // 3. Chủ phòng bắt đầu ván
    const p1GameStatePromise = waitForType(ws1, "GAME_STATE_UPDATE");
    const p2GameStatePromise = waitForType(ws2, "GAME_STATE_UPDATE");

    ws1.send(JSON.stringify({ type: "START_GAME" }));

    // Cả 2 client nhận GAME_STATE_UPDATE
    const [stateP1, stateP2] = await Promise.all([p1GameStatePromise, p2GameStatePromise]);
    expect(stateP1.type).toBe("GAME_STATE_UPDATE");
    expect(stateP2.type).toBe("GAME_STATE_UPDATE");
    expect(stateP1.game.market).toHaveLength(5);

    // Bảo mật server-authoritative: Lá bài của đối thủ P2 bị che đối với P1
    const oppInP1 = stateP1.game.players.find((p) => p.id === p2Id);
    expect(oppInP1.hand.every((c) => c.isHidden)).toBe(true);

    // 4. Client 1 thực hiện nước đi (Chọn lá Chợ 0)
    const updateP1AfterPick = waitForType(ws1, "GAME_STATE_UPDATE");
    const updateP2AfterPick = waitForType(ws2, "GAME_STATE_UPDATE");
    ws1.send(JSON.stringify({ type: "ACTION_PICK_MARKET", marketIndex: 0 }));

    const [afterPickP1, afterPickP2] = await Promise.all([updateP1AfterPick, updateP2AfterPick]);
    expect(afterPickP1.game.currentPlayerIndex).toBe(1); // Chuyển lượt sang Client 2
    expect(afterPickP1.game.players[afterPickP1.game.currentPlayerIndex].id).toBe(p2Id);
    expect(afterPickP2.game.currentPlayerIndex).toBe(1);
    expect(afterPickP2.game.players[afterPickP2.game.currentPlayerIndex].id).toBe(p2Id);

    // 5. Thử nghiệm rớt mạng & Reconnect cho Client 2
    ws2.close();

    const ws2Reconnect = new WebSocket(WS_URL);
    await new Promise((res) => ws2Reconnect.once("open", res));

    ws2Reconnect.send(JSON.stringify({ type: "RECONNECT", roomCode, playerId: p2Id, token: p2Token }));
    const reconMsg = await waitForType(ws2Reconnect, "RECONNECTED");
    expect(reconMsg.type).toBe("RECONNECTED");

    const restoredState = await waitForType(ws2Reconnect, "GAME_STATE_UPDATE");
    expect(restoredState.type).toBe("GAME_STATE_UPDATE");

    // Dọn dẹp kết nối
    ws1.close();
    ws2Reconnect.close();
  });
});
