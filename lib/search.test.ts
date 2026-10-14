/**
 * FILE: lib/search.test.ts
 * Kiểm thử lõi tìm kiếm U3.2 — cửa U3: gõ "dan bau" ra Đàn bầu.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { normalizeVi, scoreMatch, searchItems, buildSearchIndex, pushSearchHistory, loadSearchHistory } from "./search";

describe("normalizeVi", () => {
  it("bỏ dấu tiếng Việt và đổi đ→d", () => {
    expect(normalizeVi("Đàn bầu")).toBe("dan bau");
    expect(normalizeVi("Ngũ Cung")).toBe("ngu cung");
    expect(normalizeVi("  Có   Dấu  ")).toBe("co dau");
  });

  it("giữ nguyên chuỗi không dấu", () => {
    expect(normalizeVi("dan bau")).toBe("dan bau");
  });
});

describe("scoreMatch", () => {
  it("ưu tiên khớp đầu chuỗi", () => {
    expect(scoreMatch("dan", "dan bau hoc dan dat")).toBe(100);
  });
  it("khớp đầu từ phụ", () => {
    expect(scoreMatch("bau", "dan bau truc lang")).toBe(80);
  });
  it("substring giữa chuỗi", () => {
    expect(scoreMatch("am s", "trong am sac vang")).toBe(70);
  });
  it("chịu gõ sai nhẹ (subsequence)", () => {
    expect(scoreMatch("dnbau", "dan bau")).toBe(35);
  });
  it("trượt = 0", () => {
    expect(scoreMatch("xyz", "dan bau")).toBe(0);
  });
});

describe("searchItems — cửa U3", () => {
  beforeEach(() => {
    // stub localStorage cho test lịch sử
    const store: Record<string, string> = {};
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
      },
      dispatchEvent: () => {},
    });
  });

  it('gõ "dan bau" — kết quả đầu tiên là Đàn bầu, link /nhac-cu/dan-bau', () => {
    const r = searchItems("dan bau");
    expect(r.items.length).toBeGreaterThan(0);
    const top = r.items[0];
    expect(top.label).toBe("Đàn bầu");
    expect(top.href).toBe("/nhac-cu/dan-bau");
  });

  it('gõ có dấu "đàn bầu" cũng ra Đàn bầu', () => {
    const r = searchItems("đàn bầu");
    expect(r.items.some((i) => i.label === "Đàn bầu")).toBe(true);
  });

  it('gõ sai "dnbau" vẫn ra Đàn bầu (subsequence)', () => {
    const r = searchItems("dnbau");
    expect(r.items.some((i) => i.label === "Đàn bầu")).toBe(true);
  });

  it("tìm 'đàn': tên có âm 'Đàn' nằm trong kết quả (đồng âm 'dân' chỉ xếp sau, không sai luật)", () => {
    const r = searchItems("đàn");
    const labels = r.byType["nhac-cu"].map((i) => i.label);
    expect(labels).toContain("Đàn bầu");
    expect(labels).toContain("Đàn tranh");
    expect(labels.filter((l) => l.includes("Đàn")).length).toBeGreaterThanOrEqual(5);
    // bản thể hiện đủ dấu xếp trên bản chỉ trùng vì bỏ dấu ("dân"→"dan")
    const idxMarked = labels.findIndex((l) => l.includes("Đàn"));
    const idxPlain = r.items.findIndex((i) => !i.label.includes("Đàn") && i.type === "nhac-cu");
    expect(idxPlain === -1 || idxMarked < idxPlain).toBe(true);
  });

  it("nhóm kết quả theo loại: nhạc cụ / trang / lệnh", () => {
    const r = searchItems("luat");
    expect(r.byType.trang.some((i) => i.href === "/luat-choi")).toBe(true);
  });

  it("từ khóa vô nghĩa → 0 kết quả, không crash", () => {
    const r = searchItems("zzqqxx123");
    expect(r.items).toHaveLength(0);
  });

  it("chỉ mục có 15 nhạc cụ", () => {
    const idx = buildSearchIndex();
    expect(idx.filter((i) => i.type === "nhac-cu")).toHaveLength(15);
  });

  it("lịch sử tìm kiếm: thêm tối đa 6, không trùng", () => {
    pushSearchHistory("dan bau");
    pushSearchHistory("trống đồng");
    pushSearchHistory("dan bau");
    const h = loadSearchHistory();
    expect(h).toEqual(["dan bau", "trống đồng"]);
  });
});

describe("normalizeVi recomposition (NFC)", () => {
  it("'hỏa' → 'hoa', 'hoặc' → 'hoac'", () => {
    expect(normalizeVi("hỏa")).toBe("hoa");
    expect(normalizeVi("hoặc")).toBe("hoac");
  });
});
