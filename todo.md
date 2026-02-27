# Robot Teaching Knowledge App — TODO

## ブランディング
- [x] アプリロゴ生成（産業系ブルー・ロボット/回路テーマ）
- [x] app.config.ts のアプリ名・ロゴ URL 更新
- [x] テーマカラー設定（theme.config.js）

## データモデル・ストア
- [x] Case 型定義（TypeScript interface）
- [x] AsyncStorage を使ったローカルデータストア実装
- [x] 難易度スコア計算ロジック（Score / Level）
- [x] CRUD 操作（create / read / update / delete）
- [x] 検索・フィルタロジック

## 画面実装
- [x] タブナビゲーション設定（案件一覧 / 統計）
- [x] 案件一覧画面（Home）
  - [x] 案件カードコンポーネント
  - [x] FlatList によるリスト表示
  - [x] FAB（新規登録ボタン）
  - [x] 検索バー
  - [x] フィルタチップ（Type / Level）
- [x] 案件登録フォーム（New Case）
  - [x] 基本情報セクション
  - [x] 構造メモセクション（Yes/No トグル・セグメント）
  - [x] スコア・レベルのリアルタイムプレビュー
  - [x] リスク・学びセクション
  - [x] 参照リンクセクション
  - [x] 保存処理
- [x] 案件詳細画面（Case Detail）
  - [x] ヘッダー（CaseID / Type / Level / Score）
  - [x] 構造メモ表示
  - [x] リスク・学び表示
  - [x] 参照リンク（タップでブラウザ/コピー）
  - [x] 見積・実績・差分表示
  - [x] 編集ボタン
- [x] 案件編集フォーム（Edit Case）
- [ ] フィルタ画面（Level / Type / Robot / CustomerCode）※一覧画面のチップで対応済み
- [x] 統計・サマリ画面（Stats）

## スタイル・UX
- [x] Level バッジコンポーネント（A=緑 / B=黄 / C=赤）
- [x] Type バッジコンポーネント
- [x] カード左ボーダーで Level 色表現
- [x] ダークモード対応確認
- [x] icon-symbol.tsx にアイコン追加

## 品質
- [x] 全ボタン・リンクの動作確認
- [x] 空状態（案件 0 件）の表示
- [x] エラーハンドリング（Alert / try-catch）


## 複数ユーザー対応（v0.2）

### Firebase セットアップ
- [x] Firebase プロジェクト作成・ API キー取得
- [x] Firebase Authentication 設定（Google ログイン）
- [x] Firestore データベース初期化
- [x] セキュリティルール設定（全ユーザーが全案件を読み書き可能）

### データモデル・マイグレーション
- [x] Firestore スキーマ設計（Cases コレクション）
- [x] ローカル AsyncStorage データの Firestore へのマイグレーション機能実装
- [x] ユーザー情報管理（uid・メール・表示名）

### 認証・ログイン UI
- [x] ログイン画面実装（Google ログイン）
- [x] ログアウト機能
- [x] ユーザー情報表示（ヘッダー）
- [x] 設定画面実装

### データ同期
- [x] Firestore リアルタイムリスナー実装
- [x] CRUD 操作の Firestore 連携
- [ ] オフライン対応（キャッシュ）

### テスト・品質
- [ ] 複数ユーザーでの同時編集テスト
- [ ] ログイン・ログアウト動作確認
- [ ] データ同期の確認
