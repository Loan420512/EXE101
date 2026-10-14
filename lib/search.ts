/**
 * FILE: lib/search.ts
 * Lõi tìm kiếm trên máy cho bảng lệnh Ctrl+K (U3.2).
 * - Bỏ dấu tiếng Việt, chịu gõ sai nhẹ (từ khóa cách nhau, hoặc subsequence)
 * - Tìm trên: nhạc cụ (tên, họ, âm, nốt), trang, vũ trụ, lệnh
 * - Không gọi mạng, không bên thứ ba
 */

import { INSTRUMENTS, ELEMENT_CONFIG, type ElementType } from "@/data/instruments";
import { UNIVERSES, UNIVERSE_ORDER, dispatchUniverseChange, type UniverseId } from "@/config/universes";
import { SHOW_PROFILES_EVENT } from "@/components/WhoIsPlaying";

export type SearchItemType = "nhac-cu" | "trang" | "lenh";

export interface SearchItem {
  id: string;
  type: SearchItemType;
  label: string;
  sub: string;
  /** từ khóa tìm (còn dấu, chữ thường) — lượt 1 */
  haystack: string;
  /** từ khóa đã bỏ dấu — lượt 2 (người dùng gõ không dấu) */
  haystackNoflat?: string;
  href?: string;
  run?: () => void;
  /** thứ tự ưu tiên khi điểm hòa */
  rank?: number;
}

/** Bỏ dấu tiếng Việt + chữ thường + NFC (nên "hỏa"→"hoa", "hoặc"→"hoac") + gộp khoảng trắng */
export function normalizeVi(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Điểm khớp: 100 khớp đầu từ khóa, 70 khớp substring, 35 subsequence (chịu gõ sai nhẹ), 0 trượt.
 * query/item đều đã normalize.
 */
export function scoreMatch(query: string, haystack: string): number {
  if (!query) return 1;
  if (haystack.slice(0, query.length) === query) return 100;
  const wordHit = tokenize(haystack).includes(query);
  if (wordHit) return 80;
  if (haystack.includes(query)) return 70;
  // subsequence: "danbbau" vẫn ra "dan bau"
  let hi = 0;
  for (const ch of query) {
    const found = haystack.indexOf(ch, hi);
    if (found === -1) return 0;
    hi = found + 1;
  }
  return 35;
}

/** Tách token theo khoảng trắng VÀ dấu câu ("vo oc," → "vo", "oc") */
const tokenSplit = /[\s,.;:!?()"'\u2013\u2014\u2010-]+/g;
function tokenize(haystack: string): string[] {
  return haystack
    .split(tokenSplit)
    .filter(Boolean)
    .map((t) => t.toLowerCase().normalize("NFC"));
}

interface PageDef { name: string; sub: string; href: string; kw: string; rank: number }

const PAGES: PageDef[] = [
  { name: "Khám phá", sub: "Trang chủ — billboard và các hàng ngang", href: "/", kw: "kham pha trang chu home", rank: 2 },
  { name: "Duyệt theo hành", sub: "Ô màu lớn, bộ lọc họ và âm", href: "/duyet", kw: "duyet browse filter mau hanh", rank: 2 },
  { name: "Bộ bài", sub: "45 lá bài của 15 nhạc cụ", href: "/bo-bai", kw: "bo bai card deck 45 la", rank: 3 },
  { name: "Chơi với Bot", sub: "Đấu ngay trên trình duyệt", href: "/choi-thu-ngay", kw: "choi bot dau tu thuc hanh", rank: 2 },
  { name: "Luật chơi", sub: "Bản cho bé 7+ và bản thi đấu", href: "/luat-choi", kw: "luat choi rules pham quy trinh tau", rank: 3 },
  { name: "Ngũ hành", sub: "Sơ đồ tương sinh tương khắc", href: "/ngu-hanh", kw: "ngu hanh wuxing tuong sinh khac", rank: 4 },
  { name: "Sân chơi ngũ âm", sub: "Gõ một giai điệu ngũ cung", href: "/san-choi-ngu-am", kw: "san choi ngu am giai diep piano", rank: 4 },
  { name: "Quiz: Bạn hợp họ nào?", sub: "5 câu hỏi vui", href: "/quiz", kw: "quiz ban hop ho nao", rank: 5 },
  { name: "Hồ sơ", sub: "Hồ sơ trên máy, đổi người chơi", href: "/ho-so", kw: "ho so profile tai khoan", rank: 5 },
  { name: "Giới thiệu & Đội ngũ", sub: "Về Ngũ Cung", href: "/#doi-ngu", kw: "gioi thieu doi ngu ve chung toi about", rank: 6 },
];

/** Bộ hai trường tìm: còn dấu (lượt 1) + bỏ dấu (lượt 2) */
function hayPair(source: string): { haystack: string; haystackNoflat: string } {
  return {
    haystack: source.toLowerCase().replace(/\s+/g, " ").trim(),
    haystackNoflat: normalizeVi(source),
  };
}

function buildInstruments(items: SearchItem[]) {
  for (const inst of INSTRUMENTS) {
    const cfg = ELEMENT_CONFIG[inst.element as ElementType];
    items.push({
      id: `inst-${inst.id}`,
      type: "nhac-cu",
      label: inst.name,
      sub: `Họ ${inst.elementName} · Âm ${inst.tone} · Nốt ${inst.noteName ?? cfg.note}`,
      ...hayPair(`${inst.name} ${inst.elementName} ${inst.tone} ${inst.noteName ?? ""} ${cfg.name} ${cfg.note} ${inst.summaryVerbatim}`),
      href: `/nhac-cu/${inst.slug}`,
      rank: 1,
    });
  }
}

function buildCommands(items: SearchItem[]) {
  for (const uid of UNIVERSE_ORDER) {
    const kit = UNIVERSES[uid as UniverseId];
    items.push({
      id: `cmd-u-${uid}`,
      type: "lenh",
      label: `Chuyển sang vũ trụ ${kit.label}`,
      sub: `Phím tắt ${kit.shortcut} · ${kit.description}`,
      ...hayPair(`chuyen vu tru ${kit.label} ${kit.labelEn} ${uid} hanh`),
      run: () => dispatchUniverseChange(uid as UniverseId),
      rank: 7,
    });
  }
  items.push({
    id: "cmd-profiles",
    type: "lenh",
    label: "Đổi hồ sơ — Ai đang chơi?",
    sub: "Quản lý hồ sơ lưu trên máy",
    ...hayPair("doi ho so ai dang choi profile"),
    run: () => window.dispatchEvent(new CustomEvent(SHOW_PROFILES_EVENT)),
    rank: 7,
  });
}

let indexCache: SearchItem[] | null = null;

export function buildSearchIndex(): SearchItem[] {
  if (indexCache) return indexCache;
  const items: SearchItem[] = [];
  buildInstruments(items);
  for (const p of PAGES) {
    items.push({
      id: `page-${p.href}`,
      type: "trang",
      label: p.name,
      sub: p.sub,
      ...hayPair(`${p.name} ${p.kw}`),
      href: p.href,
      rank: p.rank,
    });
  }
  buildCommands(items);
  indexCache = items;
  return items;
}

export interface SearchResult {
  items: SearchItem[];
  byType: Record<SearchItemType, SearchItem[]>;
}

/** Tìm với query thô (có dấu hoặc không dấu đều được) */
export function searchItems(rawQuery: string, index = buildSearchIndex()): SearchResult {
  const qMarkless = normalizeVi(rawQuery);
  const words = qMarkless.split(" ").filter(Boolean);
  const markedWords = rawQuery.toLowerCase().normalize("NFC").split(/\s+/).filter(Boolean);
  const many = words.length > 1;

  /**
   * Bậc điểm: 100 nguyên-từ-còn-dấu · 95 nguyên-từ-bỏ-dấu
   * · 80/70/35 các bậc mờ khi gõ nhanh ("danbbau" vẫn ra "dan bau").
   * Nhiều từ: mọi từ phải đạt bậc nguyên từ (95+).
   */
  const scoreItem = (item: SearchItem): number => {
    if (words.length === 0) return 1;
    const mkSet = new Set(tokenize(item.haystack));
    const nfSet = item.haystackNoflat ? new Set(tokenize(item.haystackNoflat)) : new Set<string>();
    let total = 0;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const mw = markedWords[i] ?? w;
      if (mkSet.has(w) || mkSet.has(mw)) { total += 100; continue; }
      if (nfSet.has(w)) { total += 95; continue; }
      if (many) return 0;
      const hay = item.haystackNoflat ?? item.haystack;
      const padded = " " + hay.replace(tokenSplit, " ").replace(/\s+/g, " ").trim() + " ";
      if (padded.includes(" " + w)) { total += 80; continue; }
      if (padded.includes(w)) { total += 70; continue; }
      if (scoreMatch(w, padded) === 35) { total += 35; continue; }
      return 0;
    }
    return total / words.length;
  };

  const scored = index
    .map((item) => ({ item, score: scoreItem(item) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.item.rank ?? 9) - (b.item.rank ?? 9))
    .slice(0, 12);

  const byType: Record<SearchItemType, SearchItem[]> = {
    "nhac-cu": [], trang: [], lenh: [],
  };
  for (const { item } of scored) byType[item.type].push(item);
  return { items: scored.map((x) => x.item), byType };
}

const HISTORY_KEY = "ngucung_search_history";

export function loadSearchHistory(): string[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function pushSearchHistory(query: string) {
  const q = query.trim();
  if (!q) return;
  try {
    const list = [q, ...loadSearchHistory().filter((x) => x !== q)].slice(0, 6);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // bộ nhớ bị chặn — bỏ qua lịch sử, không ảnh hưởng tìm kiếm
  }
}
