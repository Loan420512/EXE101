import { describe, it, expect } from "vitest";
import { WebSocket } from "ws";

function waitMessage(ws) {
  return new Promise((resolve, reject) => {
    ws.once("message", (data) => {
      try {
        resolve(JSON.parse(data.toString()));
      } catch (e) {
        reject(e);
      }
    });
    ws.once("error", reject);
  });
}

describe("WebSocket Realtime Multiplayer (M6)", () => {
  it("hai người chơi kết nối, tạo phòng, bắt đầu ván, đi nước và khôi phục khi reconnect", async () => {
    const WS_URL = "ws://localhost:4000";

    // 1. Client 1 (Chủ phòng) tạo phòng
    const ws1 = new WebSocket(WS_URL);
    await new Promise((res) => ws1.once("open", res));

    ws1.send(JSON.stringify({ type: "CREATE_ROOM", name: "Nguyễn Văn A" }));
    const res1 = await waitMessage(ws1);
    expect(res1.type).toBe("ROOM_CREATED");
    expect(res1.roomCode).toHaveLength(4);

    const roomCode = res1.roomCode;
    const p1Token = res1.token;
    const p1Id = res1.playerId;

    // 2. Client 2 (Khách) vào phòng
    const ws2 = new WebSocket(WS_URL);
    await new Promise((res) => ws2.once("open", res));

    ws2.send(JSON.stringify({ type: "JOIN_ROOM", roomCode, name: "Trần Thị B" }));
    const res2 = await waitMessage(ws2);
    expect(res2.type).toBe("ROOM_JOINED");

    const p2Token = res2.token;
    const p2Id = res2.playerId;

    // Đọc tin nhắn cập nhật người chơi cho Client 1
    const update1 = await waitMessage(ws1);
    expect(update1.type).toBe("ROOM_PLAYERS_UPDATE");
    expect(update1.players).toHaveLength(2);

    // 3. Chủ phòng bắt đầu ván
    ws1.send(JSON.stringify({ type: "START_GAME" }));

    // Cả 2 client nhận GAME_STATE_UPDATE
    const [stateP1, stateP2] = await Promise.all([waitMessage(ws1), waitMessage(ws2)]);
    expect(stateP1.type).toBe("GAME_STATE_UPDATE");
    expect(stateP2.type).toBe("GAME_STATE_UPDATE");
    expect(stateP1.game.market).toHaveLength(5);

    // Bảo mật server-authoritative: Lá bài của đối thủ P2 bị che đối với P1
    const oppInP1 = stateP1.game.players.find((p) => p.id === p2Id);
    expect(oppInP1.hand.every((c) => c.isHidden)).toBe(true);

    // 4. Client 1 thực hiện nước đi (Chọn lá Chợ 0)
    const updateP1AfterPick = waitMessage(ws1);
    const updateP2AfterPick = waitMessage(ws2);
    ws1.send(JSON.stringify({ type: "ACTION_PICK_MARKET", marketIndex: 0 }));

    const [afterPick1, afterPick2] = await Promise.all([updateP1AfterPick, updateP2AfterPick]);
    expect(afterPick1.game.currentPlayerIndex).toBe(1);

    // 5. Thử nghiệm rớt mạng & Reconnect cho Client 2
    ws2.close();

    const ws2Reconnect = new WebSocket(WS_URL);
    await new Promise((res) => ws2Reconnect.once("open", res));

    ws2Reconnect.send(JSON.stringify({ type: "RECONNECT", roomCode, playerId: p2Id, token: p2Token }));
    const reconMsg = await waitMessage(ws2Reconnect);
    expect(reconMsg.type).toBe("RECONNECTED");

    const restoredState = await waitMessage(ws2Reconnect);
    expect(restoredState.type).toBe("GAME_STATE_UPDATE");

    // Dọn dẹp kết nối
    ws1.close();
    ws2Reconnect.close();
  });
});
