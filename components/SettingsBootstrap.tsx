"use client";

/**
 * FILE: components/SettingsBootstrap.tsx — U7
 * Áp cài đặt đã lưu (cỡ chữ, tương phản, chuyển động, sáng/tối, hiệu ứng,
 * chế độ Bé) lên <html> ngay khi trang hiện ra, và bắt phím tắt toàn cục.
 * Không render gì.
 */

import { useEffect } from "react";
import { readSettings, applyToDOM } from "@/lib/settings";

export default function SettingsBootstrap() {
  useEffect(() => {
    applyToDOM(readSettings());
  }, []);

  return null;
}
