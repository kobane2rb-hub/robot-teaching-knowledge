// ============================================================
// Robot Teaching Knowledge App — 案件フォームコンポーネント
// ============================================================

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { calcScore, calcLevel } from "@/lib/scoring";
import { LevelBadge } from "@/components/badges";
import type { Case, CaseInput, CaseType, MergeComplexType } from "@/lib/types";

interface CaseFormProps {
  initialValues?: Case;
  onSubmit: (input: Omit<CaseInput, "caseId">) => Promise<void>;
  onCancel: () => void;
}

const CASE_TYPES: CaseType[] = ["新規", "機種追加", "改造"];
const MERGE_TYPES: MergeComplexType[] = ["Simple", "Complex", "None"];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CaseForm({ initialValues, onSubmit, onCancel }: CaseFormProps) {
  const colors = useColors();
  const isEdit = !!initialValues;

  const [date, setDate] = useState(initialValues?.date ?? today());
  const [type, setType] = useState<CaseType>(initialValues?.type ?? "改造");
  const [robot, setRobot] = useState(initialValues?.robot ?? "");
  const [customerCode, setCustomerCode] = useState(initialValues?.customerCode ?? "");
  const [siteCode, setSiteCode] = useState(initialValues?.siteCode ?? "");
  const [mainSubStructure, setMainSubStructure] = useState(initialValues?.mainSubStructure ?? "");
  const [bufferCount, setBufferCount] = useState(String(initialValues?.bufferCount ?? "0"));
  const [midIn, setMidIn] = useState(initialValues?.midIn ?? false);
  const [midOut, setMidOut] = useState(initialValues?.midOut ?? false);
  const [mergeComplex, setMergeComplex] = useState<MergeComplexType>(initialValues?.mergeComplex ?? "None");
  const [riskMemo, setRiskMemo] = useState(initialValues?.riskMemo ?? "");
  const [learning, setLearning] = useState(initialValues?.learning ?? "");
  const [estimateH, setEstimateH] = useState(
    initialValues?.estimateH != null ? String(initialValues.estimateH) : ""
  );
  const [actualH, setActualH] = useState(
    initialValues?.actualH != null ? String(initialValues.actualH) : ""
  );
  const [specLink, setSpecLink] = useState(initialValues?.specLink ?? "");
  const [backupLink, setBackupLink] = useState(initialValues?.backupLink ?? "");
  const [otherLink, setOtherLink] = useState(initialValues?.otherLink ?? "");
  const [saving, setSaving] = useState(false);

  // リアルタイムスコア計算
  const bufNum = parseInt(bufferCount, 10) || 0;
  const liveScore = calcScore({ bufferCount: bufNum, midIn, midOut, mergeComplex });
  const liveLevel = calcLevel(liveScore);

  const handleSubmit = useCallback(async () => {
    if (!robot.trim()) {
      Alert.alert("入力エラー", "ロボット（メーカー＋機種）を入力してください");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        date: date || today(),
        type,
        robot: robot.trim(),
        customerCode: customerCode.trim(),
        siteCode: siteCode.trim(),
        mainSubStructure: mainSubStructure.trim(),
        bufferCount: bufNum,
        midIn,
        midOut,
        mergeComplex,
        riskMemo: riskMemo.trim(),
        learning: learning.trim(),
        estimateH: estimateH ? parseFloat(estimateH) : null,
        actualH: actualH ? parseFloat(actualH) : null,
        specLink: specLink.trim(),
        backupLink: backupLink.trim(),
        otherLink: otherLink.trim(),
      });
    } finally {
      setSaving(false);
    }
  }, [
    date, type, robot, customerCode, siteCode, mainSubStructure,
    bufNum, midIn, midOut, mergeComplex, riskMemo, learning,
    estimateH, actualH, specLink, backupLink, otherLink, onSubmit,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ナビゲーションバー */}
      <View style={[styles.navbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={onCancel}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.navBtnText, { color: colors.muted }]}>キャンセル</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>
          {isEdit ? "案件を編集" : "新規案件登録"}
        </Text>
        <Pressable
          onPress={handleSubmit}
          disabled={saving}
          style={({ pressed }) => [styles.navBtn, { opacity: pressed || saving ? 0.6 : 1 }]}
        >
          <Text style={[styles.navBtnText, { color: colors.primary, fontWeight: "700" }]}>
            {saving ? "保存中…" : "保存"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* スコアプレビュー */}
        <View style={[styles.scorePreview, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
          <Text style={[styles.scoreLabel, { color: colors.muted }]}>現在のスコア（リアルタイム）</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>{liveScore} 点</Text>
            <LevelBadge level={liveLevel} size="md" />
          </View>
        </View>

        {/* セクション：基本情報 */}
        <SectionHeader title="基本情報" colors={colors} />
        <View style={[styles.formGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FormRow label="記録日" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={date}
              onChangeText={setDate}
              placeholder="2025-01-01"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="案件種別" colors={colors}>
            <SegmentControl
              options={CASE_TYPES}
              value={type}
              onChange={(v) => setType(v as CaseType)}
              colors={colors}
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="ロボット *" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={robot}
              onChangeText={setRobot}
              placeholder="例: FANUC R-2000iC"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="顧客コード" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={customerCode}
              onChangeText={setCustomerCode}
              placeholder="例: C001"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="サイトコード" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={siteCode}
              onChangeText={setSiteCode}
              placeholder="例: S01"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
          </FormRow>
        </View>

        {/* セクション：構造メモ */}
        <SectionHeader title="構造メモ（スコア計算）" colors={colors} />
        <View style={[styles.formGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.textAreaRow}>
            <Text style={[styles.label, { color: colors.foreground }]}>メイン/サブ構造</Text>
            <TextInput
              style={[styles.textArea, { color: colors.foreground, borderColor: colors.border }]}
              value={mainSubStructure}
              onChangeText={setMainSubStructure}
              placeholder="メイン/サブの特徴、プログラム構造のメモ…"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          <Separator colors={colors} />
          <FormRow label="取り置き数" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={bufferCount}
              onChangeText={setBufferCount}
              placeholder="0"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="途中投入" colors={colors}>
            <Switch
              value={midIn}
              onValueChange={setMidIn}
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={midIn ? colors.primary : colors.muted}
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="途中払い出し" colors={colors}>
            <Switch
              value={midOut}
              onValueChange={setMidOut}
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={midOut ? colors.primary : colors.muted}
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="合流設計" colors={colors}>
            <SegmentControl
              options={MERGE_TYPES}
              value={mergeComplex}
              onChange={(v) => setMergeComplex(v as MergeComplexType)}
              colors={colors}
            />
          </FormRow>
        </View>

        {/* セクション：リスク・学び */}
        <SectionHeader title="リスク・学び" colors={colors} />
        <View style={[styles.formGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.textAreaRow}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              <IconSymbol name="exclamationmark.triangle" size={14} color="#D97706" />
              {"  "}危険ポイント
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.foreground, borderColor: colors.border }]}
              value={riskMemo}
              onChangeText={setRiskMemo}
              placeholder="注意すべきポイント、ハマりやすい箇所…"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <Separator colors={colors} />
          <View style={styles.textAreaRow}>
            <Text style={[styles.label, { color: colors.foreground }]}>
              <IconSymbol name="lightbulb" size={14} color="#D97706" />
              {"  "}学び・設計パターン
            </Text>
            <TextInput
              style={[styles.textArea, { color: colors.foreground, borderColor: colors.border }]}
              value={learning}
              onChangeText={setLearning}
              placeholder="設計思想、パターン名の候補、気づき…"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* セクション：見積・実績 */}
        <SectionHeader title="見積・実績" colors={colors} />
        <View style={[styles.formGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FormRow label="見積h" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={estimateH}
              onChangeText={setEstimateH}
              placeholder="空可"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="実績h" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={actualH}
              onChangeText={setActualH}
              placeholder="空可"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </FormRow>
          {estimateH && actualH && (
            <>
              <Separator colors={colors} />
              <FormRow label="差分 Δh" colors={colors}>
                <Text style={[styles.deltaText, {
                  color: parseFloat(actualH) - parseFloat(estimateH) > 0
                    ? "#DC2626"
                    : parseFloat(actualH) - parseFloat(estimateH) < 0
                    ? "#16A34A"
                    : colors.muted
                }]}>
                  {(parseFloat(actualH) - parseFloat(estimateH) > 0 ? "+" : "")}
                  {(parseFloat(actualH) - parseFloat(estimateH)).toFixed(1)}h
                </Text>
              </FormRow>
            </>
          )}
        </View>

        {/* セクション：参照リンク */}
        <SectionHeader title="参照リンク" colors={colors} />
        <View style={[styles.formGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FormRow label="仕様書リンク" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={specLink}
              onChangeText={setSpecLink}
              placeholder="Drive URL / ローカルパス"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="バックアップ" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={backupLink}
              onChangeText={setBackupLink}
              placeholder="Drive URL / ローカルパス"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </FormRow>
          <Separator colors={colors} />
          <FormRow label="補足リンク" colors={colors}>
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              value={otherLink}
              onChangeText={setOtherLink}
              placeholder="動画・写真・メモ等"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              returnKeyType="done"
            />
          </FormRow>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---- 共通サブコンポーネント ----

function SectionHeader({
  title,
  colors,
}: {
  title: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Text style={[styles.sectionHeader, { color: colors.muted }]}>{title}</Text>
  );
}

function FormRow({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.formRow}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.inputWrapper}>{children}</View>
    </View>
  );
}

function Separator({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.separator, { backgroundColor: colors.border }]} />
  );
}

function SegmentControl({
  options,
  value,
  onChange,
  colors,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.segment, { backgroundColor: colors.background, borderColor: colors.border }]}>
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={[
            styles.segmentItem,
            value === opt && { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              { color: value === opt ? "#FFFFFF" : colors.muted },
            ]}
          >
            {opt}
          </Text>
        </Pressable>
      ))}
    </View>
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
    minWidth: 60,
  },
  navBtnText: {
    fontSize: 16,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  scorePreview: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  scoreLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
  },
  formGroup: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  label: {
    fontSize: 15,
    flex: 1,
  },
  inputWrapper: {
    flex: 1.2,
    alignItems: "flex-end",
  },
  input: {
    fontSize: 15,
    textAlign: "right",
    minWidth: 120,
  },
  textAreaRow: {
    padding: 16,
    gap: 8,
  },
  textArea: {
    fontSize: 15,
    lineHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  segmentItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
  },
  deltaText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
