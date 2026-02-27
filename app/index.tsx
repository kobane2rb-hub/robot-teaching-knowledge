// ============================================================
// Robot Teaching Knowledge App — ルートスクリーン（ログイン判定）
// ============================================================

import React from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { useColors } from "@/hooks/use-colors";

export default function RootScreen() {
  const { user, loading } = useFirebaseAuth();
  const colors = useColors();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // ホーム画面へリダイレクト
  return <Redirect href="/(tabs)" />;
}
