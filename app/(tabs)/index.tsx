// ============================================================
// Robot Teaching Knowledge App — 案件一覧画面
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainer } from "@/components/screen-container";
import { CaseCard } from "@/components/case-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCases } from "@/lib/cases-context";
import { useColors } from "@/hooks/use-colors";
import { useFirebaseAuth } from "@/lib/firebase-auth-context";
import type { FilterState, CaseType, LevelType } from "@/lib/types";

const ALL_TYPES: CaseType[] = ["新規", "機種追加", "改造"];
const ALL_LEVELS: LevelType[] = ["A", "B", "C"];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useFirebaseAuth();
  const { filteredCases, filter, setFilter, loading } = useCases();
  const [searchText, setSearchText] = useState(filter.searchText);

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      setFilter({ ...filter, searchText: text });
    },
    [filter, setFilter]
  );

  const toggleType = useCallback(
    (type: CaseType) => {
      const types = filter.types.includes(type)
        ? filter.types.filter((t) => t !== type)
        : [...filter.types, type];
      setFilter({ ...filter, types });
    },
    [filter, setFilter]
  );

  const toggleLevel = useCallback(
    (level: LevelType) => {
      const levels = filter.levels.includes(level)
        ? filter.levels.filter((l) => l !== level)
        : [...filter.levels, level];
      setFilter({ ...filter, levels });
    },
    [filter, setFilter]
  );

  const hasActiveFilter =
    filter.types.length > 0 ||
    filter.levels.length > 0 ||
    filter.robot !== "" ||
    filter.customerCode !== "";

  const clearFilters = useCallback(() => {
    setFilter({
      types: [],
      levels: [],
      robot: "",
      customerCode: "",
      searchText: filter.searchText,
    });
  }, [filter.searchText, setFilter]);

  const fabBottom = Platform.OS === "web" ? 24 : insets.bottom + 80;

  const handleLogout = async () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/");
          } catch (error) {
            Alert.alert("エラー", "ログアウトに失敗しました");
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>案件一覧</Text>
          {user && (
            <Text style={[{ fontSize: 11, color: colors.muted, marginTop: 2 }]}>{user.email}</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Text style={[styles.count, { color: colors.muted }]}>
            {filteredCases.length} 件
          </Text>
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* 検索バー */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.muted} />
          <TextInput
            style={[styles.searchText, { color: colors.foreground }]}
            placeholder="構造メモ・リスク・学びを検索…"
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* フィルタチップ */}
      <View style={[styles.filterRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.filterChips}>
          {ALL_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={type}
              active={filter.types.includes(type)}
              onPress={() => toggleType(type)}
              colors={colors}
            />
          ))}
          <View style={styles.divider} />
          {ALL_LEVELS.map((level) => (
            <FilterChip
              key={level}
              label={`Lv.${level}`}
              active={filter.levels.includes(level)}
              onPress={() => toggleLevel(level)}
              colors={colors}
              levelColor={level === "A" ? "#16A34A" : level === "B" ? "#D97706" : "#DC2626"}
            />
          ))}
          {hasActiveFilter && (
            <Pressable
              onPress={clearFilters}
              style={[styles.clearBtn, { borderColor: colors.border }]}
            >
              <IconSymbol name="xmark" size={12} color={colors.muted} />
              <Text style={[styles.clearBtnText, { color: colors.muted }]}>クリア</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* リスト */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredCases.length === 0 ? (
        <EmptyState colors={colors} hasFilter={hasActiveFilter || searchText.length > 0} />
      ) : (
        <FlatList
          data={filteredCases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CaseCard item={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: fabBottom + 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push("/case/new" as any)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: fabBottom,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </Pressable>
    </ScreenContainer>
  );
}

function FilterChip({
  label,
  active,
  onPress,
  colors,
  levelColor,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
  levelColor?: string;
}) {
  const activeColor = levelColor ?? colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? activeColor + "20" : colors.background,
          borderColor: active ? activeColor : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? activeColor : colors.muted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function EmptyState({
  colors,
  hasFilter,
}: {
  colors: ReturnType<typeof useColors>;
  hasFilter: boolean;
}) {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
        {hasFilter ? "条件に一致する案件がありません" : "案件がまだありません"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        {hasFilter
          ? "フィルタを変更してください"
          : "右下の + ボタンから最初の案件を登録しましょう"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  count: {
    fontSize: 14,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
  },
  filterRow: {
    borderBottomWidth: 0.5,
    paddingVertical: 8,
  },
  filterChips: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 6,
    flexWrap: "nowrap",
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#D1D9E6",
    marginHorizontal: 2,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  clearBtnText: {
    fontSize: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
