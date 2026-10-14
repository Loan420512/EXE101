"use client";

/**
 * FILE: lib/useIsClient.ts
 * MỤC ĐÍCH: cho biết component đã ở phía trình duyệt (sau hydration) mà không cần
 * setState trong useEffect (luật lint react-hooks/set-state-in-effect).
 * - server render: false → không vẽ lớp phủ dễ thay đổi theo localStorage
 * - client sau hydration: true → lúc này mới đọc được hồ sơ/lịch sử trên máy
 */

import { useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}
function getTrue() {
  return true;
}
function getFalse() {
  return false;
}

export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNoop, getTrue, getFalse);
}
