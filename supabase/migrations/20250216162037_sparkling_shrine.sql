/*
  # Add battery usage history

  1. New Tables
    - `battery_usage_history`
      - `id` (uuid, primary key)
      - `battery_id` (uuid, references batteries)
      - `device_id` (uuid, references devices)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `battery_usage_history` table
    - Add policies for authenticated users to manage their own history
*/

-- Create battery usage history table
CREATE TABLE battery_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id UUID NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE battery_usage_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own battery usage history"
  ON battery_usage_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own battery usage history"
  ON battery_usage_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own battery usage history"
  ON battery_usage_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX battery_usage_history_battery_id_idx ON battery_usage_history(battery_id);
CREATE INDEX battery_usage_history_device_id_idx ON battery_usage_history(device_id);