# Robot Teaching Knowledge App — Design Plan

## Overview

ロボット改造・機種追加案件のプログラム読解ナレッジを個人で蓄積・検索・活用するためのモバイルアプリ。iOS ファーストの設計で、現場での素早い入力と後からの検索・振り返りを重視する。

---

## Color Choices

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| primary | `#1A6FBF` | `#4DA3FF` | アクセント・ボタン・ハイライト（産業系ブルー） |
| background | `#F2F4F7` | `#0F1117` | 画面背景 |
| surface | `#FFFFFF` | `#1C2030` | カード・入力フォーム背景 |
| foreground | `#0D1117` | `#E8EDF5` | 主要テキスト |
| muted | `#6B7280` | `#8A9AB5` | 補助テキスト・ラベル |
| border | `#D1D9E6` | `#2A3350` | 区切り線・枠線 |
| success | `#16A34A` | `#4ADE80` | Level A（低難易度） |
| warning | `#D97706` | `#FBBF24` | Level B（中難易度） |
| error | `#DC2626` | `#F87171` | Level C（高難易度） |
| levelA | `#16A34A` | `#4ADE80` | Level A バッジ |
| levelB | `#D97706` | `#FBBF24` | Level B バッジ |
| levelC | `#DC2626` | `#F87171` | Level C バッジ |

---

## Screen List

1. **案件一覧（Home）** — メインタブ。全案件カードリスト + 検索バー
2. **案件登録（New Case）** — 新規案件の入力フォーム（フローティングボタンから遷移）
3. **案件詳細（Case Detail）** — 学び・リスク・リンク・スコアの詳細表示
4. **案件編集（Edit Case）** — 既存案件の編集フォーム（詳細画面から遷移）
5. **フィルタ・絞り込み（Filter）** — Level / Type / Robot / CustomerCode で絞り込み
6. **統計・サマリ（Stats）** — 案件数・平均スコア・Level 分布などの集計ビュー

---

## Primary Content and Functionality

### 案件一覧（Home）
- 検索バー（MainSubStructure / RiskMemo / Learning のフリーテキスト検索）
- フィルタチップ（Type / Level / Robot）
- 案件カード：CaseID・Date・Robot・Type・Level バッジ・Score・MainSubStructure の冒頭
- FAB（Floating Action Button）で新規登録へ
- スワイプ削除

### 案件登録 / 編集フォーム
- セクション分け：基本情報 / 構造メモ / リスク・学び / 参照リンク
- Yes/No トグル：MidIn / MidOut
- セグメントコントロール：Type（新規/機種追加/改造）/ MergeComplex（Simple/Complex/None）
- 数値入力：BufferCount / EstimateH / ActualH
- テキストエリア：MainSubStructure / RiskMemo / Learning
- テキスト入力：CustomerCode / SiteCode / Robot / SpecLink / BackupLink / OtherLink
- 自動計算表示：Score / Level（リアルタイムプレビュー）

### 案件詳細
- ヘッダー：CaseID・Date・Type バッジ・Level バッジ・Score
- 構造メモセクション：Robot・MainSubStructure・BufferCount・MidIn/Out・MergeComplex
- リスク・学びセクション：RiskMemo・Learning
- 参照リンクセクション：SpecLink・BackupLink・OtherLink（タップでブラウザ/パスコピー）
- 見積・実績セクション：EstimateH・ActualH・差分（Δh）

### フィルタ画面
- Type チェックボックス（新規/機種追加/改造）
- Level チェックボックス（A/B/C）
- Robot テキスト検索
- CustomerCode テキスト検索
- リセットボタン

### 統計・サマリ
- 総案件数・Level 別件数（A/B/C）
- 平均スコア・最高スコア
- Type 別件数
- 見積 vs 実績の平均差分

---

## Key User Flows

### 新規案件登録
1. 一覧画面の FAB タップ
2. 入力フォームが開く（モーダルまたはプッシュ）
3. 基本情報（Type / Robot / CustomerCode / SiteCode）入力
4. 構造メモ（MainSubStructure / BufferCount / MidIn / MidOut / MergeComplex）入力
5. スコア・レベルがリアルタイムで表示される
6. リスク・学び（RiskMemo / Learning）入力
7. 参照リンク（SpecLink / BackupLink / OtherLink）入力
8. 保存 → 一覧に戻る

### 案件検索・絞り込み
1. 一覧画面の検索バーにキーワード入力
2. または フィルタアイコンタップ → フィルタ画面
3. Level=C のみ表示など条件設定
4. 絞り込み結果を一覧で確認

### 仕様書リンクアクセス
1. 一覧または検索から案件を選択
2. 詳細画面の「参照リンク」セクション
3. SpecLink タップ → ブラウザで開く or パスをクリップボードにコピー

### 見積・実績振り返り
1. 詳細画面の「見積・実績」セクション
2. EstimateH と ActualH の差分（Δh）を確認
3. 編集ボタンから実績を追記

---

## Layout Principles

- **ナビゲーション**: タブバー 2タブ（案件一覧 / 統計）+ モーダル/プッシュで詳細・フォーム
- **カード**: 角丸 12px・シャドウ小・左ボーダーで Level 色を表現
- **バッジ**: Level A=緑・B=黄・C=赤の小さな角丸バッジ
- **フォーム**: セクションヘッダー付きグループ化、iOS Settings スタイル
- **FAB**: 右下固定、primary カラー、`+` アイコン
