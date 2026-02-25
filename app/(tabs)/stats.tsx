// ============================================================
// Robot Teaching Knowledge App — 統計・サマリ画面
// ============================================================

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useCases } from "@/lib/cases-context";
import { useColors } from "@/hooks/use-colors";

export default function StatsScreen() {
  const colors = useColors();
  const { stats, cases } = useCases();

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* ヘッダー */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>統計・サマリ</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 総案件数 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>総案件数</Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>{stats.total}</Text>
          <Text style={[styles.subLabel, { color: colors.muted }]}>件</Text>
        </View>

        {/* Level 分布 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>難易度レベル分布</Text>
          <View style={styles.levelRow}>
            <LevelStat label="Lv.A" count={stats.levelA} color="#16A34A" total={stats.total} />
            <LevelStat label="Lv.B" count={stats.levelB} color="#D97706" total={stats.total} />
            <LevelStat label="Lv.C" count={stats.levelC} color="#DC2626" total={stats.total} />
          </View>
          {/* バー */}
          {stats.total > 0 && (
            <View style={styles.barContainer}>
              {stats.levelA > 0 && (
                <View
                  style={[
                    styles.barSegment,
                    { flex: stats.levelA, backgroundColor: "#16A34A" },
                  ]}
                />
              )}
              {stats.levelB > 0 && (
                <View
                  style={[
                    styles.barSegment,
                    { flex: stats.levelB, backgroundColor: "#D97706" },
                  ]}
                />
              )}
              {stats.levelC > 0 && (
                <View
                  style={[
                    styles.barSegment,
                    { flex: stats.levelC, backgroundColor: "#DC2626" },
                  ]}
                />
              )}
            </View>
          )}
        </View>

        {/* スコア統計 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>難易度スコア</Text>
          <View style={styles.statRow}>
            <StatItem label="平均スコア" value={stats.avgScore.toFixed(1)} colors={colors} />
            <StatItem label="最高スコア" value={String(stats.maxScore)} colors={colors} />
          </View>
        </View>

        {/* 案件種別 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>案件種別</Text>
          <View style={styles.statRow}>
            <StatItem label="新規" value={String(stats.typeNew)} colors={colors} accent="#1D4ED8" />
            <StatItem label="機種追加" value={String(stats.typeAdd)} colors={colors} accent="#15803D" />
            <StatItem label="改造" value={String(stats.typeMod)} colors={colors} accent="#C2410C" />
          </View>
        </View>

        {/* 見積・実績差分 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>見積 vs 実績</Text>
          {stats.avgDiff !== null ? (
            <View>
              <Text style={[styles.bigNumber, {
                color: stats.avgDiff > 0 ? "#DC2626" : stats.avgDiff < 0 ? "#16A34A" : colors.foreground
              }]}>
                {stats.avgDiff > 0 ? "+" : ""}{stats.avgDiff.toFixed(1)}h
              </Text>
              <Text style={[styles.subLabel, { color: colors.muted }]}>
                平均差分（実績 − 見積）
              </Text>
              <Text style={[styles.note, { color: colors.muted }]}>
                {stats.avgDiff > 0
                  ? "平均で見積より超過しています"
                  : stats.avgDiff < 0
                  ? "平均で見積より短縮できています"
                  : "見積と実績が一致しています"}
              </Text>
            </View>
          ) : (
            <Text style={[styles.noData, { color: colors.muted }]}>
              見積・実績を両方入力した案件がありません
            </Text>
          )}
        </View>

        {/* スコアリング係数説明 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>スコアリング仮ルール（v0.1）</Text>
          <View style={styles.formulaContainer}>
            <FormulaRow label="取り置き×n" value="n × 2 点" colors={colors} />
            <FormulaRow label="途中投入あり" value="+3 点" colors={colors} />
            <FormulaRow label="途中払出あり" value="+2 点" colors={colors} />
            <FormulaRow label="合流: Simple" value="+0 点" colors={colors} />
            <FormulaRow label="合流: Complex" value="+2 点" colors={colors} />
            <FormulaRow label="合流: None" value="+3 点" colors={colors} />
          </View>
          <View style={[styles.levelGuide, { borderTopColor: colors.border }]}>
            <LevelGuideRow level="A" range="0〜6 点" color="#16A34A" colors={colors} />
            <LevelGuideRow level="B" range="7〜11 点" color="#D97706" colors={colors} />
            <LevelGuideRow level="C" range="12 点〜" color="#DC2626" colors={colors} />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function LevelStat({
  label,
  count,
  color,
  total,
}: {
  label: string;
  count: number;
  color: string;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={styles.levelStat}>
      <Text style={[styles.levelLabel, { color }]}>{label}</Text>
      <Text style={[styles.levelCount, { color }]}>{count}</Text>
      <Text style={{ fontSize: 11, color: "#6B7280" }}>{pct}%</Text>
    </View>
  );
}

function StatItem({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  accent?: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: accent ?? colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function FormulaRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.formulaRow}>
      <Text style={[styles.formulaLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.formulaValue, { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

function LevelGuideRow({
  level,
  range,
  color,
  colors,
}: {
  level: string;
  range: string;
  color: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.formulaRow}>
      <Text style={[styles.formulaLabel, { color }]}>Level {level}</Text>
      <Text style={[styles.formulaValue, { color: colors.muted }]}>{range}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 56,
  },
  subLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  levelStat: {
    alignItems: "center",
    gap: 2,
  },
  levelLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  levelCount: {
    fontSize: 28,
    fontWeight: "700",
  },
  barContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    gap: 2,
  },
  barSegment: {
    borderRadius: 4,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
  },
  noData: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },
  note: {
    fontSize: 13,
    marginTop: 6,
  },
  formulaContainer: {
    gap: 6,
  },
  formulaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  formulaLabel: {
    fontSize: 14,
  },
  formulaValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  levelGuide: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    gap: 4,
  },
});
