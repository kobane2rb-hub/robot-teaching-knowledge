// ============================================================
// Firebase Firestore を使った Cases コンテキスト
// ============================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useFirebaseAuth } from "./firebase-auth-context";
import type { Case, CaseInput } from "./types";
import { calcScore, calcLevel } from "./scoring";

interface FirebaseCasesContextType {
  cases: Case[];
  loading: boolean;
  addCase: (input: Omit<CaseInput, "caseId">) => Promise<void>;
  editCase: (caseId: string, input: Omit<CaseInput, "caseId">) => Promise<void>;
  removeCase: (caseId: string) => Promise<void>;
}

const FirebaseCasesContext = createContext<FirebaseCasesContextType | undefined>(undefined);

export function FirebaseCasesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useFirebaseAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  // Firestore リアルタイムリスナー
  useEffect(() => {
    if (!user) {
      setCases([]);
      setLoading(false);
      return;
    }

    const casesRef = collection(db, "cases");
    const q = query(casesRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedCases: Case[] = [];
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const score = calcScore({
            bufferCount: data.bufferCount || 0,
            midIn: data.midIn || false,
            midOut: data.midOut || false,
            mergeComplex: data.mergeComplex || "None",
          });
          const level = calcLevel(score);

          const createdAtDate = data.createdAt?.toDate?.() || new Date();
          const updatedAtDate = data.updatedAt?.toDate?.() || new Date();

          const caseObj: Case = {
            id: docSnapshot.id,
            caseId: data.caseId || `CASE-${docSnapshot.id.slice(0, 8)}`,
            date: data.date || new Date().toISOString().slice(0, 10),
            type: data.type || "改造",
            robot: data.robot || "",
            customerCode: data.customerCode || "",
            siteCode: data.siteCode || "",
            mainSubStructure: data.mainSubStructure || "",
            bufferCount: data.bufferCount || 0,
            midIn: data.midIn || false,
            midOut: data.midOut || false,
            mergeComplex: data.mergeComplex || "None",
            riskMemo: data.riskMemo || "",
            learning: data.learning || "",
            estimateH: data.estimateH || null,
            actualH: data.actualH || null,
            specLink: data.specLink || "",
            backupLink: data.backupLink || "",
            otherLink: data.otherLink || "",
            score,
            level,
            createdAt: createdAtDate.toISOString(),
            updatedAt: updatedAtDate.toISOString(),
          };

          loadedCases.push(caseObj);
        });

        setCases(loadedCases);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore リスナーエラー:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addCase = async (input: Omit<CaseInput, "caseId">) => {
    if (!user) throw new Error("ユーザーがログインしていません");

    try {
      const casesRef = collection(db, "cases");
      const caseId = `CASE-${Date.now()}`;

      await addDoc(casesRef, {
        ...input,
        caseId,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("案件追加エラー:", error);
      throw error;
    }
  };

  const editCase = async (caseId: string, input: Omit<CaseInput, "caseId">) => {
    if (!user) throw new Error("ユーザーがログインしていません");

    try {
      const caseRef = doc(db, "cases", caseId);
      await updateDoc(caseRef, {
        ...input,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("案件編集エラー:", error);
      throw error;
    }
  };

  const removeCase = async (caseId: string) => {
    if (!user) throw new Error("ユーザーがログインしていません");

    try {
      const caseRef = doc(db, "cases", caseId);
      await deleteDoc(caseRef);
    } catch (error) {
      console.error("案件削除エラー:", error);
      throw error;
    }
  };

  return (
    <FirebaseCasesContext.Provider value={{ cases, loading, addCase, editCase, removeCase }}>
      {children}
    </FirebaseCasesContext.Provider>
  );
}

export function useFirebaseCases() {
  const context = useContext(FirebaseCasesContext);
  if (context === undefined) {
    throw new Error("useFirebaseCases must be used within FirebaseCasesProvider");
  }
  return context;
}
