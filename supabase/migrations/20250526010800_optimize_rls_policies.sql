-- パフォーマンス最適化: RLSポリシーでのauth.uid()関数の再評価を防止

-- batteriesテーブルのポリシーを最適化
DROP POLICY IF EXISTS "Users can view their own batteries" ON batteries;
CREATE POLICY "Users can view their own batteries"
  ON batteries
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own batteries" ON batteries;
CREATE POLICY "Users can insert their own batteries"
  ON batteries
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own batteries" ON batteries;
CREATE POLICY "Users can update their own batteries"
  ON batteries
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own batteries" ON batteries;
CREATE POLICY "Users can delete their own batteries"
  ON batteries
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- battery_groupsテーブルのポリシーも最適化
DROP POLICY IF EXISTS "Users can view their own battery groups" ON battery_groups;
CREATE POLICY "Users can view their own battery groups"
  ON battery_groups
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own battery groups" ON battery_groups;
CREATE POLICY "Users can insert their own battery groups"
  ON battery_groups
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own battery groups" ON battery_groups;
CREATE POLICY "Users can update their own battery groups"
  ON battery_groups
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own battery groups" ON battery_groups;
CREATE POLICY "Users can delete their own battery groups"
  ON battery_groups
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- devicesテーブルのポリシーも最適化
DROP POLICY IF EXISTS "Users can view their own devices" ON devices;
CREATE POLICY "Users can view their own devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own devices" ON devices;
CREATE POLICY "Users can insert their own devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own devices" ON devices;
CREATE POLICY "Users can update their own devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own devices" ON devices;
CREATE POLICY "Users can delete their own devices"
  ON devices
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- user_plansテーブルのポリシーも最適化
DROP POLICY IF EXISTS "Users can view their own plan" ON user_plans;
CREATE POLICY "Users can view their own plan"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own plan" ON user_plans;
CREATE POLICY "Users can insert their own plan"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own plan" ON user_plans;
CREATE POLICY "Users can update their own plan"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own plan" ON user_plans;
CREATE POLICY "Users can delete their own plan"
  ON user_plans
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
