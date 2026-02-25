// ============================================================
// Robot Teaching Knowledge App — 案件詳細画面
// ============================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { ScreenContainer } from "@/components/screen-container";
import { LevelBadge, TypeBadge } from "@/components/badges";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCases } from "@/lib/cases-context";
import { useColors } from "@/hooks/use-colors";
import type { Case } from "@/lib/types";

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { cases, removeCase } = useCases();
  const [item, setItem] = useState<Case | null>(null);

  useEffect(() => {
    if (id) {
      const found = cases.find((c) => c.id === id);
      setItem(found ?? null);
    }
  }, [id, cases]);

  if (!item) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={{ color: colors.muted }}>案件が見つかりません</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleEdit = () => {
    router.push(`/case/edit/${item.id}` as any);
  };

  const handleDelete = () => {
    Alert.alert(
      "案件を削除",
      `${item.caseId} を削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            await removeCase(item.id);
            router.back();
          },
        },
      ]
    );
  };

  const openLink = async (url: string) => {
    if (!url) return;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("エラー", "URLを開けませんでした");
      }
    } else {
      // ローカルパスはクリップボードにコピー
      await Clipboard.setStringAsync(url);
      Alert.alert("コピーしました", "パスをクリップボードにコピーしました");
    }
  };

  const diff =
    item.estimateH != null && item.actualH != null
      ? item.actualH - item.estimateH
      : null;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* ナビゲーションバー */}
      <View style={[styles.navbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <IconSymbol name="arrow.left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>{item.caseId}</Text>
        <View style={styles.navActions}>
          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="pencil" size={20} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="trash" size={20} color="#DC2626" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダーカード */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.badges}>
              <TypeBadge type={item.type} />
              <LevelBadge level={item.level} score={item.score} />
            </View>
            <Text style={[styles.date, { color: colors.muted }]}>{item.date}</Text>
          </View>
          <Text style={[styles.robotName, { color: colors.foreground }]}>
            {item.robot || "—"}
          </Text>
          {(item.customerCode || item.siteCode) && (
            <Text style={[styles.codes, { color: colors.muted }]}>
              {[item.customerCode, item.siteCode].filter(Boolean).join(" / ")}
            </Text>
          )}
        </View>

        {/* 構造メモ */}
        <DetailSection title="構造メモ" icon="doc.text" colors={colors}>
          <DetailRow label="メイン/サブ構造" colors={colors}>
            <Text style={[styles.bodyText, { color: colors.foreground }]}>
              {item.mainSubStructure || "—"}
            </Text>
          </DetailRow>
          <Separator colors={colors} />
          <View style={styles.chipRow}>
            <ScoreChip label={`取り置き × ${item.bufferCount}`} colors={colors} />
            {item.midIn && <ScoreChip label="途中投入あり" colors={colors} accent="#1A6FBF" />}
            {item.midOut && <ScoreChip label="途中払出あり" colors={colors} accent="#1A6FBF" />}
            <ScoreChip label={`合流: ${item.mergeComplex}`} colors={colors} />
          </View>
        </DetailSection>

        {/* リスク・学び */}
        <DetailSection title="リスク・学び" icon="exclamationmark.triangle" colors={colors}>
          {item.riskMemo ? (
            <>
              <Text style={[styles.subLabel, { color: colors.muted }]}>危険ポイント</Text>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{item.riskMemo}</Text>
            </>
          ) : null}
          {item.riskMemo && item.learning && <Separator colors={colors} />}
          {item.learning ? (
            <>
              <Text style={[styles.subLabel, { color: colors.muted }]}>学び・設計パターン</Text>
              <Text style={[styles.bodyText, { color: colors.foreground }]}>{item.learning}</Text>
            </>
          ) : null}
          {!item.riskMemo && !item.learning && (
            <Text style={[styles.bodyText, { color: colors.muted }]}>未入力</Text>
          )}
        </DetailSection>

        {/* 見積・実績 */}
        <DetailSection title="見積・実績" icon="clock" colors={colors}>
          <View style={styles.hoursRow}>
            <HourStat label="見積h" value={item.estimateH} colors={colors} />
            <HourStat label="実績h" value={item.actualH} colors={colors} />
            <HourStat
              label="差分 Δh"
              value={diff}
              colors={colors}
              accent={diff != null ? (diff > 0 ? "#DC2626" : diff < 0 ? "#16A34A" : undefined) : undefined}
              prefix={diff != null && diff > 0 ? "+" : ""}
            />
          </View>
        </DetailSection>

        {/* 参照リンク */}
        <DetailSection title="参照リンク" icon="link" colors={colors}>
          {item.specLink ? (
            <LinkRow
              label="仕様書"
              url={item.specLink}
              onPress={() => openLink(item.specLink)}
              colors={colors}
            />
          ) : null}
          {item.specLink && item.backupLink && <Separator colors={colors} />}
          {item.backupLink ? (
            <LinkRow
              label="バックアップ"
              url={item.backupLink}
              onPress={() => openLink(item.backupLink)}
              colors={colors}
            />
          ) : null}
          {item.backupLink && item.otherLink && <Separator colors={colors} />}
          {item.otherLink ? (
            <LinkRow
              label="補足"
              url={item.otherLink}
              onPress={() => openLink(item.otherLink)}
              colors={colors}
            />
          ) : null}
          {!item.specLink && !item.backupLink && !item.otherLink && (
            <Text style={[styles.bodyText, { color: colors.muted }]}>リンクなし</Text>
          )}
        </DetailSection>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---- サブコンポーネント ----

function DetailSection({
  title,
  icon,
  children,
  colors,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.sectionTitleRow}>
        <IconSymbol name={icon} size={16} color={colors.muted} />
        <Text style={[styles.sectionTitle, { color: colors.muted }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DetailRow({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.muted }]}>{label}</Text>
      {children}
    </View>
  );
}

function Separator({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
}

function ScoreChip({
  label,
  colors,
  accent,
}: {
  label: string;
  colors: ReturnType<typeof useColors>;
  accent?: string;
}) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.background, borderColor: accent ?? colors.border }]}>
      <Text style={[styles.chipText, { color: accent ?? colors.muted }]}>{label}</Text>
    </View>
  );
}

function HourStat({
  label,
  value,
  colors,
  accent,
  prefix = "",
}: {
  label: string;
  value: number | null | undefined;
  colors: ReturnType<typeof useColors>;
  accent?: string;
  prefix?: string;
}) {
  return (
    <View style={styles.hourStat}>
      <Text style={[styles.hourValue, { color: accent ?? colors.foreground }]}>
        {value != null ? `${prefix}${value}h` : "—"}
      </Text>
      <Text style={[styles.hourLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

function LinkRow({
  label,
  url,
  onPress,
  colors,
}: {
  label: string;
  url: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const isUrl = url.startsWith("http://") || url.startsWith("https://");
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.linkLeft}>
        <IconSymbol
          name={isUrl ? "arrow.up.right.square" : "doc.on.clipboard"}
          size={18}
          color={colors.primary}
        />
        <View>
          <Text style={[styles.linkLabel, { color: colors.muted }]}>{label}</Text>
          <Text style={[styles.linkUrl, { color: colors.primary }]} numberOfLines={1}>
            {url}
          </Text>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={16} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  navBtn: {
    padding: 4,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  navActions: {
    flexDirection: "row",
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  date: {
    fontSize: 13,
  },
  robotName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  codes: {
    fontSize: 13,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailRow: {
    gap: 4,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 4,
  },
  separator: {
    height: 0.5,
    marginVertical: 10,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  chip: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  hourStat: {
    alignItems: "center",
    gap: 4,
  },
  hourValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  hourLabel: {
    fontSize: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  linkLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  linkUrl: {
    fontSize: 13,
    maxWidth: 240,
  },
});
