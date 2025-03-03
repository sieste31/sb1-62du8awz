/*
  # 電池管理システムの初期スキーマ

  1. 新規テーブル
    - `battery_groups`
      - 電池グループの基本情報を管理
      - `id`: プライマリーキー
      - `type`: 電池の種類（単1形、単2形など）
      - `kind`: 電池タイプ（充電池/使い切り）
      - `count`: 本数
      - `voltage`: 電圧
      - `notes`: メモ
      - `image_url`: 画像URL
      - `created_at`: 作成日時
      - `user_id`: 所有ユーザーID

    - `batteries`
      - 個別の電池情報を管理
      - `id`: プライマリーキー
      - `group_id`: 所属する電池グループのID
      - `status`: 電池の状態（充電済み/空）
      - `last_checked`: 最終チェック日
      - `device_id`: 設置されているデバイスのID（任意）
      - `created_at`: 作成日時
      - `user_id`: 所有ユーザーID

    - `devices`
      - デバイス情報を管理
      - `id`: プライマリーキー
      - `name`: デバイス名
      - `type`: デバイスタイプ
      - `battery_type`: 使用する電池の種類
      - `battery_count`: 必要な電池の本数
      - `purchase_date`: 購入日
      - `notes`: メモ
      - `created_at`: 作成日時
      - `user_id`: 所有ユーザーID

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - ユーザーは自身のデータのみアクセス可能
*/

-- battery_groupsテーブルの作成
CREATE TABLE battery_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('disposable', 'rechargeable')),
  count INTEGER NOT NULL CHECK (count > 0),
  voltage NUMERIC(3,1) NOT NULL,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_type CHECK (
    type IN ('単1形', '単2形', '単3形', '単4形', '9V形')
  )
);

-- batteriesテーブルの作成
CREATE TABLE batteries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES battery_groups(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('charged', 'empty')),
  last_checked TIMESTAMPTZ,
  device_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- devicesテーブルの作成
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('smartphone', 'speaker', 'camera')),
  battery_type TEXT NOT NULL,
  battery_count INTEGER NOT NULL CHECK (battery_count > 0),
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_battery_type CHECK (
    battery_type IN ('単1形', '単2形', '単3形', '単4形', '9V形')
  )
);

-- RLSの設定
ALTER TABLE battery_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE batteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- battery_groupsのポリシー
CREATE POLICY "Users can view their own battery groups"
  ON battery_groups
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own battery groups"
  ON battery_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own battery groups"
  ON battery_groups
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own battery groups"
  ON battery_groups
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- batteriesのポリシー
CREATE POLICY "Users can view their own batteries"
  ON batteries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own batteries"
  ON batteries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own batteries"
  ON batteries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own batteries"
  ON batteries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- devicesのポリシー
CREATE POLICY "Users can view their own devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices"
  ON devices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);