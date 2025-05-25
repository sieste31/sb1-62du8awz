-- Fix function search path for security

-- Modify create_user_plan function
CREATE OR REPLACE FUNCTION create_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type, max_battery_groups, max_devices)
  VALUES (NEW.id, 'free', 5, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Modify assign_next_slot_number function
CREATE OR REPLACE FUNCTION assign_next_slot_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(slot_number), 0) + 1
  INTO NEW.slot_number
  FROM batteries
  WHERE group_id = NEW.group_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Modify update_device_has_batteries function
CREATE OR REPLACE FUNCTION update_device_has_batteries()
RETURNS TRIGGER AS $$
DECLARE
  device_id uuid;
  required_count integer;
  installed_count integer;
BEGIN
  -- Determine which device ID to update
  device_id := COALESCE(
    NEW.device_id,
    OLD.device_id,
    NEW.id,
    OLD.id
  );

  -- Skip if no device ID (can happen during DELETE)
  IF device_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the required battery count for the device
  SELECT battery_count INTO required_count
  FROM devices
  WHERE id = device_id;

  -- Count installed batteries
  SELECT COUNT(*) INTO installed_count
  FROM batteries
  WHERE device_id = device_id;

  -- Update the device's has_batteries status
  UPDATE devices
  SET has_batteries = (required_count = installed_count)
  WHERE id = device_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
