# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

### 基本コマンド
- `npm run dev` - 開発サーバーの起動（Vite使用）
- `npm run build` - プロダクションビルド
- `npm run lint` - ESLintによるコード検査
- `npm run preview` - ビルド結果のプレビュー

### TypeScript設定
- `tsconfig.json` - メインのTypeScript設定
- `tsconfig.app.json` - アプリケーション用設定
- `tsconfig.node.json` - Node.js用設定

## プロジェクト構成

このプロジェクトはReact + TypeScript + Viteを使用したテトリスゲームです。

### アーキテクチャ概要
- **状態管理**: カスタムフック `useTetris` でゲーム状態を管理
- **ゲームループ**: `requestAnimationFrame` ベースの時間制御システム
- **UI**: TailwindCSSによるレスポンシブデザイン
- **ゲームロジック**: 純粋関数による分離されたゲームロジック

### 主要ディレクトリ
- `src/components/` - React コンポーネント
- `src/hooks/` - カスタムフック（主に `useTetris.ts`）
- `src/types/` - TypeScript型定義
- `src/utils/` - ゲームロジック関数
- `src/constants/` - ゲーム定数（テトロミノ形状、色など）

### 核となるファイル
- `src/hooks/useTetris.ts` - ゲーム状態とロジックの中心
- `src/utils/tetris.ts` - ピース操作、衝突判定、ライン消去などの核心機能
- `src/types/tetris.ts` - 型定義
- `src/components/Tetris.tsx` - メインゲームコンポーネント

### ゲームフロー
1. **レベル選択**: LevelSelectコンポーネントで開始レベルを選択
2. **ゲーム開始**: useTetrisフックが状態を管理し、ゲームループを開始
3. **ピース操作**: キーボードイベントでピースを操作
4. **ライン消去**: 完成したラインを自動検出・消去
5. **レベルアップ**: 10ライン消去ごとにレベル上昇、落下速度増加

### 重要な機能
- **ゴーストピース**: 現在のピースの落下予想位置を表示
- **ホールド機能**: ピースを一時保存してあとで使用
- **ハードドロップ**: スペースキーで即座に落下
- **ウォールキック**: 回転時の位置調整
- **ポーズ機能**: P キーまたはボタンでゲーム一時停止

### 使用技術スタック
- React 18
- TypeScript
- Vite（ビルドツール）
- TailwindCSS（スタイリング）
- ESLint（コード品質）
- Lucide React（アイコン）

### コーディング規約
- TypeScriptの厳密な型チェック有効
- React Hooksの規則に従った開発
- ESLintの推奨設定を使用
- 関数型プログラミングアプローチ（特にゲームロジック）