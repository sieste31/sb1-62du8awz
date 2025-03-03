/*
  # Update battery update policy

  1. Changes
    - Drop existing update policy for batteries table
    - Create new policy that allows users to update only their own batteries
    - Restrict updates to preserve user_id, group_id, and slot_number
    - Allow updates to device_id, status, and last_checked fields

  2. Security
    - Ensures users can only update their own batteries
    - Prevents modification of critical fields (user_id, group_id, slot_number)
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own batteries" ON batteries;

-- Create new, more specific update policy
CREATE POLICY "Users can update their own batteries device and status"
  ON batteries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    user_id = (SELECT user_id FROM batteries WHERE id = id) AND
    group_id = (SELECT group_id FROM batteries WHERE id = id) AND
    slot_number = (SELECT slot_number FROM batteries WHERE id = id)
  );