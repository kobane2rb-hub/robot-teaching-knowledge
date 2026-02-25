// ============================================================
// Robot Teaching Knowledge App — 案件カードコンポーネント
// ============================================================

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LevelBadge, TypeBadge } from "./badges";
import { getLevelColor } from "@/lib/scoring";
import { useColors } from "@/hooks/use-colors";
import type { Case } from "@/lib/types";
import { useCases } from "@/lib/cases-context";

interface CaseCardProps {
  item: Case;
}

export function CaseCard({ item }: CaseCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { removeCase } = useCases();
  const levelColors = getLevelColor(item.level);

  const handlePress = () => {
    router.push(`/case/${item.id}` as any);
  };

  const handleLongPress = () => {
    Alert.alert(
      "案件を削除",
      `${item.caseId} を削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: () => removeCase(item.id),
        },
      ]
    );
  };

  const truncate = (text: string, len = 60) =>
    text.length > len ? text.slice(0, len) + "…" : text;

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderLeftColor: levelColors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* ヘッダー行 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.caseId, { color: colors.primary }]}>
            {item.caseId}
          </Text>
          <Text style={[styles.date, { color: colors.muted }]}>
            {item.date}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <LevelBadge level={item.level} score={item.score} size="sm" />
        </View>
      </View>

      {/* ロボット・タイプ行 */}
      <View style={styles.row}>
        <Text style={[styles.robot, { color: colors.foreground }]} numberOfLines={1}>
          {item.robot || "—"}
        </Text>
        <TypeBadge type={item.type} size="sm" />
      </View>

      {/* 構造メモ */}
      {item.mainSubStructure ? (
        <Text style={[styles.memo, { color: colors.muted }]} numberOfLines={2}>
          {truncate(item.mainSubStructure)}
        </Text>
      ) : null}

      {/* フッター：スコア要因 */}
      <View style={styles.footer}>
        <ScoreChip label={`Buffer×${item.bufferCount}`} />
        {item.midIn && <ScoreChip label="途中投入" />}
        {item.midOut && <ScoreChip label="途中払出" />}
        {item.mergeComplex !== "None" && (
          <ScoreChip label={`合流:${item.mergeComplex}`} />
        )}
      </View>
    </Pressable>
  );
}

function ScoreChip({ label }: { label: string }) {
  const colors = useColors();
  return (
    <View style={[styles.chip, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Text style={[styles.chipText, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {},
  caseId: {
    fontSize: 14,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  robot: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  memo: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  chip: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 11,
  },
});
