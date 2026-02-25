// ============================================================
// Robot Teaching Knowledge App — 難易度スコア計算
// ============================================================
// Score = BufferCount*2
//       + IF(MidIn=Yes, 3, 0)
//       + IF(MidOut=Yes, 2, 0)
//       + MergeComplex係数（Simple=0, Complex=2, None=3）
//
// Level A: Score <= 6
// Level B: Score 7〜11
// Level C: Score >= 12

import type { MergeComplexType, LevelType } from "./types";

export function calcScore(params: {
  bufferCount: number;
  midIn: boolean;
  midOut: boolean;
  mergeComplex: MergeComplexType;
}): number {
  const { bufferCount, midIn, midOut, mergeComplex } = params;

  // 合流設計係数：Simple=合流あり・単純, Complex=合流あり・複雑, None=合流なし（最も単純）
  // 仕様書の仮ルール: Simple=0, Complex=2, None=3
  // ※ None は「合流設計が存在しない（設計なし）」ではなく「合流が None（なし）」の意味
  const mergeCoefficient: Record<MergeComplexType, number> = {
    Simple: 0,
    Complex: 2,
    None: 3,
  };

  return (
    bufferCount * 2 +
    (midIn ? 3 : 0) +
    (midOut ? 2 : 0) +
    mergeCoefficient[mergeComplex]
  );
}

export function calcLevel(score: number): LevelType {
  if (score <= 6) return "A";
  if (score <= 11) return "B";
  return "C";
}

export function getLevelColor(level: LevelType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "A":
      return { bg: "#DCFCE7", text: "#16A34A", border: "#16A34A" };
    case "B":
      return { bg: "#FEF3C7", text: "#D97706", border: "#D97706" };
    case "C":
      return { bg: "#FEE2E2", text: "#DC2626", border: "#DC2626" };
  }
}

export function getLevelColorDark(level: LevelType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (level) {
    case "A":
      return { bg: "#14532D", text: "#4ADE80", border: "#4ADE80" };
    case "B":
      return { bg: "#451A03", text: "#FBBF24", border: "#FBBF24" };
    case "C":
      return { bg: "#450A0A", text: "#F87171", border: "#F87171" };
  }
}

export function getTypeColor(type: string): {
  bg: string;
  text: string;
} {
  switch (type) {
    case "新規":
      return { bg: "#EFF6FF", text: "#1D4ED8" };
    case "機種追加":
      return { bg: "#F0FDF4", text: "#15803D" };
    case "改造":
      return { bg: "#FFF7ED", text: "#C2410C" };
    default:
      return { bg: "#F3F4F6", text: "#374151" };
  }
}
