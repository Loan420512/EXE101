"use client";

/**
 * FILE: components/PlayerLayer.tsx — U4
 * Lớp trình phát toàn cục: MiniPlayer luôn dính đáy mọi trang, màn "Đang phát"
 * toàn màn mở lên khi bấm vào mini-player. Đặt trong RootLayout để hàng đợi và
 * trạng thái phát không bị mất khi đổi trang.
 *
 * - Không bao giờ tự phát tiếng: chỉ phát khi người chơi bấm nút Phát.
 * - Queue rỗng thì MiniPlayer không render, và html bỏ lớp "has-player"
 *   để nội dung lấy lại khoảng đệm đáy.
 */

import { useEffect, useState } from "react";
import MiniPlayer from "@/components/MiniPlayer";
import NowPlaying from "@/components/NowPlaying";
import { player, type PlayerState } from "@/lib/player";

export default function PlayerLayer() {
  const [open, setOpen] = useState(false);
  const [hasTrack, setHasTrack] = useState(false);

  useEffect(() => {
    const sync = (s: PlayerState) => setHasTrack(s.isVisible && s.queue.length > 0);
    sync(player.state);
    return player.onUpdate(sync);
  }, []);

  // Đệm đáy cho nội dung khi mini-player hiện lên — tránh che nút cuối trang.
  useEffect(() => {
    document.documentElement.classList.toggle("has-player", hasTrack);
  }, [hasTrack]);

  return (
    <>
      <MiniPlayer onExpand={() => setOpen(true)} />
      {open && <NowPlaying onClose={() => setOpen(false)} />}
    </>
  );
}
