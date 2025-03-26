/*
  # 電池種別(type)を電池形状(shape)に変更

  1. 変更内容
    - battery_groupsテーブルの「type」カラムを「shape」に変更
    - devicesテーブルの「battery_type」カラムを「battery_shape」に変更
    - 制約の名前も更新

  2. 互換性
    - 既存のアプリケーションとの互換性のために、typeカラムは残しておく
    - 新しいshapeカラムにtypeの値をコピーする
*/

-- battery_groupsテーブルに新しいshapeカラムを追加
ALTER TABLE battery_groups ADD COLUMN shape TEXT;

-- 既存のtypeの値をshapeにコピー
UPDATE battery_groups SET shape = type;

-- shapeカラムを必須に設定
ALTER TABLE battery_groups ALTER COLUMN shape SET NOT NULL;

-- 制約を追加
ALTER TABLE battery_groups ADD CONSTRAINT valid_shape CHECK (
  shape IN ('単1形', '単2形', '単3形', '単4形', '9V形')
);

-- devicesテーブルに新しいbattery_shapeカラムを追加
ALTER TABLE devices ADD COLUMN battery_shape TEXT;

-- 既存のbattery_typeの値をbattery_shapeにコピー
UPDATE devices SET battery_shape = battery_type;

-- battery_shapeカラムを必須に設定
ALTER TABLE devices ALTER COLUMN battery_shape SET NOT NULL;

-- 制約を追加
ALTER TABLE devices ADD CONSTRAINT valid_battery_shape CHECK (
  battery_shape IN ('単1形', '単2形', '単3形', '単4形', '9V形')
);

-- コメントを更新
COMMENT ON COLUMN battery_groups.type IS '電池の種類（非推奨、shapeを使用してください）';
COMMENT ON COLUMN battery_groups.shape IS '電池の形状（例: 単1形, 単2形, 単3形など）';
COMMENT ON COLUMN devices.battery_type IS '使用する電池の種類（非推奨、battery_shapeを使用してください）';
COMMENT ON COLUMN devices.battery_shape IS '使用する電池の形状';
