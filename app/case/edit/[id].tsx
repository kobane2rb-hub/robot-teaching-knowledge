// ============================================================
// Robot Teaching Knowledge App — 案件編集画面
// ============================================================

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CaseForm } from "@/components/case-form";
import { useCases } from "@/lib/cases-context";
import { useColors } from "@/hooks/use-colors";
import type { Case, CaseInput } from "@/lib/types";

export default function EditCaseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { cases, editCase } = useCases();
  const [item, setItem] = useState<Case | null>(null);

  useEffect(() => {
    if (id) {
      const found = cases.find((c) => c.id === id);
      setItem(found ?? null);
    }
  }, [id, cases]);

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const handleSubmit = async (input: Omit<CaseInput, "caseId">) => {
    await editCase(item.id, input);
    router.back();
  };

  return <CaseForm initialValues={item} onSubmit={handleSubmit} onCancel={() => router.back()} />;
}
