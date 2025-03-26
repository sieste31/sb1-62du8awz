# 電池＆デバイス管理アプリ

電池とデバイスを効率的に管理するためのウェブアプリケーションです。

> **注意**: このプロジェクトは元々Next.jsで構築されていましたが、Vite+ReactのSPAアプリに移行されました。

## 機能

- 電池の登録・管理（充電池/使い切り）
- デバイスの登録・管理
- 電池の使用状況の追跡
- 電池交換履歴の記録

## 技術スタック

- Vite
- React
- TypeScript
- Tailwind CSS
- Supabase (認証・データベース・ストレージ)

## 画面構成

- 電池一覧画面
  - 電池作成画面
  - 電池詳細画面
- デバイス一覧画面
  - デバイス作成画面
  - デバイス詳細画面
  - 電池選択画面

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

ブラウザで http://localhost:5173 を開いてアプリケーションにアクセスできます。

## デプロイ

このアプリケーションは Netlify などのサービスに簡単にデプロイできます。デプロイ時には、環境変数を適切に設定してください。

## 移行情報

このプロジェクトは元々Next.jsで構築されていましたが、以下の理由でVite+ReactのSPAアプリに移行されました：

- より高速な開発環境
- シンプルなSPA構成への移行
- クライアントサイドのみの実装に焦点を当てる

主な変更点：
- Next.jsのルーティングからReact Router Domへの移行
- サーバーサイドコンポーネントの削除
- ミドルウェアの削除
- ビルド設定の更新

## 環境変数

このプロジェクトでは以下の環境変数を使用しています：

- `VITE_SUPABASE_URL`: Supabase プロジェクトの URL
- `VITE_SUPABASE_ANON_KEY`: Supabase の匿名キー

## ライセンス

[MIT](LICENSE)
