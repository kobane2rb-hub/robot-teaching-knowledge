// ============================================================
// Robot Teaching Knowledge App — マイグレーション画面
// ============================================================

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { migrateLocalDataToFirestore } from "@/lib/migration";
import { loadCases } from "@/lib/store";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function MigrationScreen() {
  const colors = useColors();
  const { user } = useFirebaseAuth();
  const [localCaseCount, setLocalCaseCount] = useState(0);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    migratedCount: number;
    error?: string;
  } | null>(null);

  // ローカルデータ件数を取得
  useEffect(() => {
    const checkLocalData = async () => {
      const cases = await loadCases();
      setLocalCaseCount(cases.length);
    };
    checkLocalData();
  }, []);

  const handleMigrate = async () => {
    if (!user) {
      Alert.alert("エラー", "ログインしてください");
      return;
    }

    if (localCaseCount === 0) {
      Alert.alert("情報", "ローカルデータがありません");
      return;
    }

    Alert.alert(
      "マイグレーション確認",
      `${localCaseCount} 件のローカルデータを Firestore にアップロードします。\n\n※ この操作は取り消せません。`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "アップロード",
          style: "default",
          onPress: async () => {
            try {
              setIsMigrating(true);
              const result = await migrateLocalDataToFirestore(user.uid);
              setMigrationResult(result);

              if (result.success) {
                Alert.alert(
                  "成功",
                  `${result.migratedCount} 件のデータをアップロードしました`,
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              } else {
                Alert.alert("エラー", result.error || "マイグレーション失敗");
              }
            } catch (error) {
              Alert.alert("エラー", "マイグレーション中にエラーが発生しました");
            } finally {
              setIsMigrating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ヘッダー */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground, marginLeft: 12 }]}>
            データマイグレーション
          </Text>
        </View>

        {/* 説明 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            ローカルデータを Firestore にアップロード
          </Text>
          <Text style={[styles.cardText, { color: colors.muted, marginTop: 8 }]}>
            このデバイスに保存されているローカルデータを、複数ユーザーで共有できる Firestore にアップロードします。
          </Text>
          <Text style={[styles.cardText, { color: colors.muted, marginTop: 12 }]}>
            アップロード後、他のユーザーもこのデータにアクセスできるようになります。
          </Text>
        </View>

        {/* ローカルデータ情報 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            ローカルデータ
          </Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[{ color: colors.muted }]}>保存されている案件数</Text>
              <Text style={[{ color: colors.foreground, fontWeight: "600" }]}>
                {localCaseCount} 件
              </Text>
            </View>
            {localCaseCount === 0 && (
              <Text style={[{ color: colors.muted, fontSize: 12, marginTop: 8 }]}>
                ローカルデータがありません
              </Text>
            )}
          </View>
        </View>

        {/* マイグレーション結果 */}
        {migrationResult && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: migrationResult.success ? "#D1FAE5" : "#FEE2E2",
                borderColor: migrationResult.success ? "#10B981" : "#EF4444",
                marginTop: 16,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: migrationResult.success ? "#059669" : "#DC2626" },
              ]}
            >
              {migrationResult.success ? "✓ アップロード完了" : "✗ アップロード失敗"}
            </Text>
            <Text
              style={[
                styles.cardText,
                { color: migrationResult.success ? "#047857" : "#991B1B", marginTop: 8 },
              ]}
            >
              {migrationResult.migratedCount} 件のデータをアップロードしました
            </Text>
          </View>
        )}

        {/* ボタン */}
        <View style={{ marginTop: "auto", paddingVertical: 16 }}>
          <Pressable
            onPress={handleMigrate}
            disabled={isMigrating || localCaseCount === 0}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: localCaseCount === 0 ? colors.border : colors.primary,
                opacity: pressed || isMigrating ? 0.8 : 1,
              },
            ]}
          >
            {isMigrating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {localCaseCount === 0 ? "ローカルデータなし" : "アップロード"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.buttonSecondary,
              {
                borderColor: colors.border,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonSecondaryText, { color: colors.foreground }]}>
              キャンセル
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
