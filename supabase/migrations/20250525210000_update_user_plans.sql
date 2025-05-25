-- プラン種別の更新と制限値の調整
ALTER TABLE user_plans 
DROP CONSTRAINT IF EXISTS user_plans_plan_type_check;

ALTER TABLE user_plans 
ADD CONSTRAINT user_plans_plan_type_check 
CHECK (plan_type IN ('free', 'standard', 'pro'));

-- 既存のfreeプランユーザーのデータを保持しつつ、プラン名を更新
UPDATE user_plans 
SET 
    plan_type = CASE 
        WHEN plan_type = 'premium' THEN 'standard'
        WHEN plan_type = 'business' THEN 'pro'
        ELSE plan_type 
    END;

-- 新規ユーザー登録時のデフォルトプランを更新
CREATE OR REPLACE FUNCTION create_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type, max_battery_groups, max_devices)
  VALUES (NEW.id, 'free', 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存ユーザーに対してデフォルトプランを設定（重複を避けるため）
INSERT INTO user_plans (user_id, plan_type, max_battery_groups, max_devices)
SELECT id, 'free', 5, 5
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_plans)
ON CONFLICT (user_id) DO NOTHING;
