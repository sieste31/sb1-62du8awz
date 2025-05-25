-- user_plansテーブルでRLSを有効化
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- SELECTポリシー: ユーザーは自分のプラン情報のみ閲覧可能
CREATE POLICY "Users can view their own plan"
  ON user_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERTポリシー: ユーザーは自分のプランのみ作成可能
CREATE POLICY "Users can insert their own plan"
  ON user_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATEポリシー: ユーザーは自分のプランのみ更新可能
CREATE POLICY "Users can update their own plan"
  ON user_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETEポリシー: 通常は不要だが、管理目的で制限
CREATE POLICY "Users can delete their own plan"
  ON user_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
