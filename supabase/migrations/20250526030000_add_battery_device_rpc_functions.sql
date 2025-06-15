-- バッテリーとデバイスの状態を安全に更新するためのRPC関数

-- デバイスから電池を取り外すRPC関数
CREATE OR REPLACE FUNCTION remove_batteries_from_device(
  p_device_id UUID,
  p_battery_ids UUID[],
  p_timestamp TIMESTAMPTZ
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- デバイスの所有者を取得
  SELECT user_id INTO v_user_id 
  FROM devices 
  WHERE devices.id = p_device_id;

  -- 電池の更新（device_idをNULLに、statusを'empty'に）
  UPDATE batteries
  SET 
    device_id = NULL, 
    status = 'empty', 
    last_changed_at = p_timestamp
  WHERE 
    batteries.id = ANY(p_battery_ids) 
    AND batteries.device_id = p_device_id
    AND batteries.user_id = v_user_id;

  -- デバイスの電池装着状態を更新
  UPDATE devices
  SET 
    has_batteries = FALSE,
    last_battery_change = p_timestamp
  WHERE 
    devices.id = p_device_id
    AND devices.user_id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION remove_batteries_from_device(UUID, UUID[], TIMESTAMPTZ) TO authenticated;

-- デバイスに電池を追加するRPC関数
CREATE OR REPLACE FUNCTION add_battery_to_device(
  p_device_id UUID,
  p_battery_id UUID,
  p_timestamp TIMESTAMPTZ
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_device_battery_count INT;
  v_current_battery_count INT;
BEGIN
  -- デバイスの所有者と必要な電池数を取得
  SELECT user_id, battery_count INTO v_user_id, v_device_battery_count
  FROM devices 
  WHERE id = p_device_id;

  -- 現在のデバイスに装着されている電池数を取得
  SELECT COUNT(*) INTO v_current_battery_count
  FROM batteries
  WHERE device_id = p_device_id;

  -- 電池数の制限をチェック
  IF v_current_battery_count >= v_device_battery_count THEN
    RAISE EXCEPTION 'デバイスの電池数の上限に達しています';
  END IF;

  -- 電池の更新
  UPDATE batteries
  SET 
    device_id = p_device_id, 
    status = 'in_use', 
    last_changed_at = p_timestamp
  WHERE 
    id = p_battery_id
    AND user_id = v_user_id
    AND device_id IS NULL;

  -- デバイスの電池装着状態を更新
  UPDATE devices
  SET 
    has_batteries = TRUE,
    last_battery_change = p_timestamp
  WHERE 
    id = p_device_id
    AND user_id = v_user_id;

  -- 使用履歴を作成
  INSERT INTO battery_usage_history (
    battery_id, 
    device_id, 
    started_at, 
    user_id
  ) VALUES (
    p_battery_id, 
    p_device_id, 
    p_timestamp, 
    v_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC関数の権限設定
GRANT EXECUTE ON FUNCTION remove_batteries_from_device(UUID, UUID[], TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION add_battery_to_device(UUID, UUID, TIMESTAMPTZ) TO authenticated;
