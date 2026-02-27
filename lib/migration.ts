// ============================================================
// AsyncStorage → Firestore マイグレーション
// ============================================================

import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { loadCases } from "./store";
import type { Case } from "./types";

/**
 * ローカル（AsyncStorage）のデータを Firestore にマイグレーションする
 */
export async function migrateLocalDataToFirestore(userId: string): Promise<{
  success: boolean;
  migratedCount: number;
  error?: string;
}> {
  try {
    // ローカルデータを読み込む
    const localCases = await loadCases();

    if (localCases.length === 0) {
      return { success: true, migratedCount: 0 };
    }

    // Firestore にアップロード
    const casesRef = collection(db, "cases");
    let migratedCount = 0;

    for (const caseData of localCases) {
      try {
        await addDoc(casesRef, {
          caseId: caseData.caseId,
          date: caseData.date,
          type: caseData.type,
          robot: caseData.robot,
          customerCode: caseData.customerCode,
          siteCode: caseData.siteCode,
          mainSubStructure: caseData.mainSubStructure,
          bufferCount: caseData.bufferCount,
          midIn: caseData.midIn,
          midOut: caseData.midOut,
          mergeComplex: caseData.mergeComplex,
          riskMemo: caseData.riskMemo,
          learning: caseData.learning,
          estimateH: caseData.estimateH,
          actualH: caseData.actualH,
          specLink: caseData.specLink,
          backupLink: caseData.backupLink,
          otherLink: caseData.otherLink,
          createdBy: userId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        migratedCount++;
      } catch (error) {
        console.error(`案件 ${caseData.caseId} のマイグレーション失敗:`, error);
        // 1件失敗してもスキップして続行
      }
    }

    return { success: true, migratedCount };
  } catch (error) {
    console.error("マイグレーション失敗:", error);
    return {
      success: false,
      migratedCount: 0,
      error: error instanceof Error ? error.message : "不明なエラー",
    };
  }
}
