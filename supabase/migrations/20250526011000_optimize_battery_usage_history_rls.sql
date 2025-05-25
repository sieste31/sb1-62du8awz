-- パフォーマンス最適化: battery_usage_historyテーブルのRLSポリシーを最適化

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view their own battery usage history" ON battery_usage_history;
DROP POLICY IF EXISTS "Users can insert their own battery usage history" ON battery_usage_history;
DROP POLICY IF EXISTS "Users can update their own battery usage history" ON battery_usage_history;

-- 最適化されたポリシーを再作成
CREATE POLICY "Users can view their own battery usage history"
  ON battery_usage_history
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own battery usage history"
  ON battery_usage_history
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own battery usage history"
  ON battery_usage_history
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
