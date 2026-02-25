// ============================================================
// Robot Teaching Knowledge App — AsyncStorage ストア
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { calcScore, calcLevel } from "./scoring";
import type { Case, CaseInput, FilterState } from "./types";

const CASES_KEY = "rtk_cases";

// ---- ID 生成 ----
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateCaseId(existingCases: Case[]): string {
  const max = existingCases.reduce((acc, c) => {
    const num = parseInt(c.caseId.replace(/\D/g, ""), 10);
    return isNaN(num) ? acc : Math.max(acc, num);
  }, 0);
  return `C${String(max + 1).padStart(3, "0")}`;
}

// ---- 永続化 ----
async function loadCases(): Promise<Case[]> {
  try {
    const raw = await AsyncStorage.getItem(CASES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Case[];
  } catch {
    return [];
  }
}

async function saveCases(cases: Case[]): Promise<void> {
  await AsyncStorage.setItem(CASES_KEY, JSON.stringify(cases));
}

// ---- CRUD ----
export async function getAllCases(): Promise<Case[]> {
  return loadCases();
}

export async function getCaseById(id: string): Promise<Case | null> {
  const cases = await loadCases();
  return cases.find((c) => c.id === id) ?? null;
}

export async function createCase(input: Omit<CaseInput, "caseId">): Promise<Case> {
  const cases = await loadCases();
  const now = new Date().toISOString();
  const score = calcScore({
    bufferCount: input.bufferCount,
    midIn: input.midIn,
    midOut: input.midOut,
    mergeComplex: input.mergeComplex,
  });
  const level = calcLevel(score);
  const newCase: Case = {
    ...input,
    id: generateId(),
    caseId: generateCaseId(cases),
    score,
    level,
    createdAt: now,
    updatedAt: now,
  };
  await saveCases([newCase, ...cases]);
  return newCase;
}

export async function updateCase(id: string, input: Partial<CaseInput>): Promise<Case | null> {
  const cases = await loadCases();
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const existing = cases[idx];
  const merged = { ...existing, ...input };
  const score = calcScore({
    bufferCount: merged.bufferCount,
    midIn: merged.midIn,
    midOut: merged.midOut,
    mergeComplex: merged.mergeComplex,
  });
  const level = calcLevel(score);
  const updated: Case = {
    ...merged,
    score,
    level,
    updatedAt: new Date().toISOString(),
  };
  cases[idx] = updated;
  await saveCases(cases);
  return updated;
}

export async function deleteCase(id: string): Promise<void> {
  const cases = await loadCases();
  await saveCases(cases.filter((c) => c.id !== id));
}

// ---- 検索・フィルタ ----
export function filterCases(cases: Case[], filter: FilterState): Case[] {
  return cases.filter((c) => {
    // Type フィルタ
    if (filter.types.length > 0 && !filter.types.includes(c.type)) return false;
    // Level フィルタ
    if (filter.levels.length > 0 && !filter.levels.includes(c.level)) return false;
    // Robot フィルタ
    if (filter.robot && !c.robot.toLowerCase().includes(filter.robot.toLowerCase())) return false;
    // CustomerCode フィルタ
    if (filter.customerCode && !c.customerCode.toLowerCase().includes(filter.customerCode.toLowerCase())) return false;
    // フリーテキスト検索
    if (filter.searchText) {
      const q = filter.searchText.toLowerCase();
      const searchable = [c.mainSubStructure, c.riskMemo, c.learning, c.robot, c.caseId].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

// ---- 統計 ----
export function calcStats(cases: Case[]) {
  const total = cases.length;
  const levelA = cases.filter((c) => c.level === "A").length;
  const levelB = cases.filter((c) => c.level === "B").length;
  const levelC = cases.filter((c) => c.level === "C").length;
  const avgScore = total > 0 ? cases.reduce((s, c) => s + c.score, 0) / total : 0;
  const maxScore = total > 0 ? Math.max(...cases.map((c) => c.score)) : 0;

  const typeNew = cases.filter((c) => c.type === "新規").length;
  const typeAdd = cases.filter((c) => c.type === "機種追加").length;
  const typeMod = cases.filter((c) => c.type === "改造").length;

  const withBoth = cases.filter((c) => c.estimateH != null && c.actualH != null);
  const avgDiff =
    withBoth.length > 0
      ? withBoth.reduce((s, c) => s + (c.actualH! - c.estimateH!), 0) / withBoth.length
      : null;

  return { total, levelA, levelB, levelC, avgScore, maxScore, typeNew, typeAdd, typeMod, avgDiff };
}
