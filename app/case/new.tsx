// ============================================================
// Robot Teaching Knowledge App — 案件登録フォーム
// ============================================================

import React from "react";
import { useRouter } from "expo-router";
import { CaseForm } from "@/components/case-form";
import { useCases } from "@/lib/cases-context";
import type { CaseInput } from "@/lib/types";

export default function NewCaseScreen() {
  const router = useRouter();
  const { addCase } = useCases();

  const handleSubmit = async (input: Omit<CaseInput, "caseId">) => {
    await addCase(input);
    router.back();
  };

  return <CaseForm onSubmit={handleSubmit} onCancel={() => router.back()} />;
}
