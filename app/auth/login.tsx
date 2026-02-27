// ============================================================
// Robot Teaching Knowledge App — ログイン画面
// ============================================================

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function LoginScreen() {
  const colors = useColors();
  const { signInWithGoogle, loading } = useFirebaseAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      Alert.alert("ログインエラー", "Google ログインに失敗しました");
      console.error(error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator color={colors.primary} size="large" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 items-center justify-center gap-8">
        {/* ロゴ・タイトル */}
        <View className="items-center gap-4">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
            <IconSymbol name="doc.text" size={40} color="#FFFFFF" />
          </View>
          <Text className="text-3xl font-bold text-foreground">
            Robot Teaching
          </Text>
          <Text className="text-base text-muted text-center">
            Knowledge App
          </Text>
        </View>

        {/* 説明文 */}
        <View className="gap-3">
          <Text className="text-sm text-muted text-center leading-relaxed">
            改造・機種追加案件のナレッジを蓄積し、
          </Text>
          <Text className="text-sm text-muted text-center leading-relaxed">
            設計力・問題解決能力を伸ばすアプリです
          </Text>
        </View>

        {/* ログインボタン */}
        <Pressable
          onPress={handleGoogleSignIn}
          disabled={isSigningIn}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed || isSigningIn ? 0.8 : 1,
            },
          ]}
        >
          {isSigningIn ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <IconSymbol name="globe" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Google でログイン</Text>
            </View>
          )}
        </Pressable>

        {/* 注記 */}
        <Text className="text-xs text-muted text-center">
          複数ユーザーで案件ナレッジを共有できます
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
