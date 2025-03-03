/*
  # Update battery status options

  1. Changes
    - Modify the `status` column in `batteries` table to support new states:
      - `charged` (満充電)
      - `in_use` (使用中)
      - `empty` (使用済み)
      - `disposed` (廃棄)

  2. Migration Strategy
    - Use a DO block to safely modify the check constraint
    - Existing data:
      - `charged` remains as `charged`
      - `empty` remains as `empty`

  3. Notes
    - This is a non-destructive change that maintains existing data
    - New states can be used immediately after migration
*/

DO $$ BEGIN
  -- Drop existing check constraint
  ALTER TABLE batteries
  DROP CONSTRAINT IF EXISTS batteries_status_check;

  -- Add new check constraint with updated status values
  ALTER TABLE batteries
  ADD CONSTRAINT batteries_status_check
  CHECK (status IN ('charged', 'in_use', 'empty', 'disposed'));
END $$;