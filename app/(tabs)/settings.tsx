// ============================================================
// Robot Teaching Knowledge App — 設定画面
// ============================================================

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SettingsScreen() {
  const colors = useColors();
  const { user, logout } = useFirebaseAuth();

  const handleLogout = async () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/auth/login");
          } catch (error) {
            Alert.alert("エラー", "ログアウトに失敗しました");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ヘッダー */}
        <Text style={[styles.title, { color: colors.foreground, marginBottom: 24 }]}>
          設定
        </Text>

        {/* ユーザー情報 */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            ユーザー情報
          </Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[{ color: colors.muted }]}>メールアドレス</Text>
              <Text style={[{ color: colors.foreground, fontWeight: "500" }]}>
                {user?.email || "-"}
              </Text>
            </View>
          </View>
        </View>

        {/* データ管理 */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            データ管理
          </Text>
          <Pressable
            onPress={() => router.push("/settings/migration")}
            style={({ pressed }) => [
              styles.menuItem,
              {
                backgroundColor: pressed ? colors.background : "transparent",
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuTitle, { color: colors.foreground }]}>
                ローカルデータをアップロード
              </Text>
              <Text style={[styles.menuSubtitle, { color: colors.muted }]}>
                AsyncStorage のデータを Firestore に移行
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </Pressable>
        </View>

        {/* アカウント */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            アカウント
          </Text>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.menuItem,
              {
                backgroundColor: pressed ? "#FEE2E2" : "transparent",
              },
            ]}
          >
            <Text style={[styles.menuTitle, { color: "#DC2626" }]}>
              ログアウト
            </Text>
          </Pressable>
        </View>

        {/* バージョン情報 */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 16 }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            アプリ情報
          </Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[{ color: colors.muted }]}>バージョン</Text>
              <Text style={[{ color: colors.foreground }]}>0.2.0</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[{ color: colors.muted }]}>ビルド</Text>
              <Text style={[{ color: colors.foreground }]}>Firebase</Text>
            </View>
          </View>
        </View>

        {/* スペーサー */}
        <View style={{ flex: 1 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
});
