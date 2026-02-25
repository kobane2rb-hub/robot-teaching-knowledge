// ============================================================
// Robot Teaching Knowledge App — バッジコンポーネント
// ============================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getLevelColor, getTypeColor } from "@/lib/scoring";
import type { LevelType, CaseType } from "@/lib/types";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface LevelBadgeProps {
  level: LevelType;
  score?: number;
  size?: "sm" | "md";
}

export function LevelBadge({ level, score, size = "md" }: LevelBadgeProps) {
  const scheme = useColorScheme();
  const colors = getLevelColor(level);
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: colors.text, fontSize: isSmall ? 11 : 13 },
        ]}
      >
        {score !== undefined ? `Lv.${level} (${score})` : `Lv.${level}`}
      </Text>
    </View>
  );
}

interface TypeBadgeProps {
  type: CaseType;
  size?: "sm" | "md";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const colors = getTypeColor(type);
  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.bg,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: colors.text, fontSize: isSmall ? 11 : 13 },
        ]}
      >
        {type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontWeight: "600",
  },
});
