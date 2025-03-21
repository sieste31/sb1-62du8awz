# 電池＆デバイス管理アプリ

電池とデバイスを効率的に管理するためのウェブアプリケーションです。

## 機能

- 電池の登録・管理（充電池/使い切り）
- デバイスの登録・管理
- 電池の使用状況の追跡
- 電池交換履歴の記録

## 技術スタック

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase (認証・データベース・ストレージ)

## 開発環境のセットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/battery-management-app.git
cd battery-management-app
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数の設定

`.env.example` ファイルを `.env` にコピーして、Supabase の認証情報を設定します。

```bash
cp .env.example .env
```

`.env` ファイルを編集して、Supabase の URL と匿名キーを設定します。

4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いてアプリケーションにアクセスできます。

## デプロイ

このアプリケーションは Vercel や Netlify などのサービスに簡単にデプロイできます。デプロイ時には、環境変数を適切に設定してください。

## 環境変数

このプロジェクトでは以下の環境変数を使用しています：

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase プロジェクトの URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase の匿名キー

## ライセンス

[MIT](LICENSE)