-- ユーザープランテーブルの作成
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
  max_battery_groups INTEGER NOT NULL DEFAULT 5,
  max_devices INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE UNIQUE INDEX user_plans_user_id_idx ON user_plans(user_id);

-- 新規ユーザー登録時に自動的にプランを作成するトリガー
CREATE OR REPLACE FUNCTION create_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type, max_battery_groups, max_devices)
  VALUES (NEW.id, 'free', 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE create_user_plan();

-- 既存ユーザーに対してデフォルトプランを設定
INSERT INTO user_plans (user_id, plan_type, max_battery_groups, max_devices)
SELECT id, 'free', 5, 5
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_plans)
ON CONFLICT (user_id) DO NOTHING;
