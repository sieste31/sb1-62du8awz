# StackBlitz から GitHub リポジトリへの登録方法

StackBlitz で作成したプロジェクトを GitHub リポジトリに登録する手順を説明します。

## 前提条件

- GitHub アカウントを持っていること
- StackBlitz プロジェクトが完成していること

## 手順

### 1. GitHub リポジトリの作成

1. [GitHub](https://github.com/) にログインします。
2. 右上の「+」アイコンをクリックし、「New repository」を選択します。
3. リポジトリ名（例：`battery-management-app`）を入力します。
4. 必要に応じて説明を追加します。
5. リポジトリの公開設定（Public または Private）を選択します。
6. 「Create repository」ボタンをクリックします。

### 2. StackBlitz からのエクスポート

#### 方法1: StackBlitz の GitHub 連携機能を使用する（推奨）

1. StackBlitz プロジェクトを開きます。
2. 左側のメニューから「GitHub」アイコンをクリックします。
   - または、上部メニューの「Project」→「Connect Repository」を選択します。
3. GitHub アカウントとの連携を許可します（初回のみ）。
4. 作成したリポジトリを選択するか、新しいリポジトリを作成します。
5. ブランチ名を確認し、「Connect Repository」をクリックします。
6. 変更内容を確認し、コミットメッセージを入力して「Commit & Push」をクリックします。

#### 方法2: 手動でファイルをエクスポートする

1. StackBlitz プロジェクトを開きます。
2. 上部メニューの「Project」→「Export Project」→「Download as ZIP」を選択します。
3. ダウンロードした ZIP ファイルを解凍します。
4. ローカルで Git リポジトリを初期化し、GitHub リポジトリに接続します：

```bash
cd battery-management-app
git init
git add .
git commit -m "Initial commit from StackBlitz"
git branch -M main
git remote add origin https://github.com/yourusername/battery-management-app.git
git push -u origin main
```

### 3. 環境変数の設定

1. `.env` ファイルが `.gitignore` に含まれていることを確認します。
2. `.env.example` ファイルが正しく作成されていることを確認します。
3. GitHub リポジトリの README.md に環境変数の設定方法が記載されていることを確認します。

### 4. GitHub リポジトリの確認

1. GitHub リポジトリにアクセスし、すべてのファイルが正しくアップロードされていることを確認します。
2. `.env` ファイルがリポジトリに含まれていないことを確認します。

## 注意事項

- 機密情報（API キーなど）は絶対に GitHub リポジトリにコミットしないでください。
- 大きなファイルや不要なファイルは `.gitignore` に追加して除外してください。
- コミット前に常に変更内容を確認してください。

## トラブルシューティング

### Q: GitHub への接続でエラーが発生する場合
A: GitHub の認証情報が正しいか確認してください。必要に応じて Personal Access Token を生成して使用します。

### Q: 一部のファイルがアップロードされない場合
A: `.gitignore` ファイルを確認し、必要なファイルが除外されていないか確認してください。

### Q: 大きなファイルをアップロードできない場合
A: GitHub には単一ファイルのサイズ制限があります。大きなファイルは Git LFS の使用を検討してください。