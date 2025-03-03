/*
  # Add device battery change tracking

  1. New Columns
    - `devices` table:
      - `last_battery_change` (timestamptz, nullable) - デバイスの最終電池交換日

  2. Changes
    - デバイス単位での電池交換日付の追加
    - 既存のレコードは初期値としてcreated_atを設定
*/

-- Add last_battery_change column to devices table
ALTER TABLE devices
ADD COLUMN last_battery_change TIMESTAMPTZ;

-- Update existing records to use created_at as last_battery_change
UPDATE devices
SET last_battery_change = created_at
WHERE last_battery_change IS NULL;