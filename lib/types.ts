// ============================================================
// Robot Teaching Knowledge App — 型定義
// ============================================================

export type CaseType = "新規" | "機種追加" | "改造";
export type MergeComplexType = "Simple" | "Complex" | "None";
export type LevelType = "A" | "B" | "C";

export interface Case {
  id: string;
  caseId: string; // 案件ID（表示用）
  date: string; // ISO 8601 date string
  type: CaseType;
  robot: string; // メーカー＋機種
  customerCode: string; // C001 等
  siteCode: string; // S01 等
  mainSubStructure: string; // 構造メモ
  bufferCount: number; // 取り置きポイント数
  midIn: boolean; // 途中投入
  midOut: boolean; // 途中払い出し
  mergeComplex: MergeComplexType; // 合流設計
  riskMemo: string; // 危険ポイント
  learning: string; // 学び
  estimateH: number | null; // 見積h
  actualH: number | null; // 実績h
  specLink: string; // 仕様書リンク
  backupLink: string; // バックアップ参照
  otherLink: string; // 補足リンク
  score: number; // 自動計算
  level: LevelType; // 自動計算
  createdAt: string;
  updatedAt: string;
}

export type CaseInput = Omit<Case, "id" | "score" | "level" | "createdAt" | "updatedAt">;

export interface FilterState {
  types: CaseType[];
  levels: LevelType[];
  robot: string;
  customerCode: string;
  searchText: string;
}
