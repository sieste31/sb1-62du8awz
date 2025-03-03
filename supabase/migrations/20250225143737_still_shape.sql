/*
  # Add battery change date tracking

  1. Changes
    - Add `last_changed_at` column to `batteries` table to track battery change dates
*/

-- Add last_changed_at column to batteries table
ALTER TABLE batteries
ADD COLUMN last_changed_at TIMESTAMPTZ;

-- Update existing records to use created_at as last_changed_at
UPDATE batteries
SET last_changed_at = created_at
WHERE last_changed_at IS NULL;