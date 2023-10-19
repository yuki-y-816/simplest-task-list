# Simplest Task List

シンプルなToDoリスト。

## URL

[Simplest Task List](https://simplest-task-list.net/)

## 使用技術

### フロントエンド

- フレームワーク
  - Next.js (13.3.0)
- ツール・ライブラリ
  - React
  - TypeScript
  - TailwindCSS
  - material-tailwind/react
  - iron-session
  - MSW
  - Prettier
- テストツール
  - Playwright

### バックエンド

- Go (1.20.3)

### データベース

- mysql (8.0.33)
- マイグレーションツール
  - goose

### インフラ・開発環境

- Docker / docker-compose
- AWS
  - Lambda
  - Server Application Model
  - Amplify
  - Relational Database Service

## 機能一覧

- ユーザー作成機能、ユーザー名変更機能
- ログイン、ログアウト
- Todoリストアイテムの追加、変更、削除

## インフラ構成図

![architecture](readme-images/architecture.drawio.svg)

## データベース設計図

![db_schema](readme-images/db_schema.drawio.svg)
