/*
  # Add image URL columns to devices and battery_groups tables

  1. Changes
    - Add `image_url` column to `devices` table
    - Add `image_url` column to `battery_groups` table

  2. Storage
    - Create storage buckets for device and battery images
    - Add RLS policies for image access
*/

-- Add image_url column to devices table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'devices' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE devices ADD COLUMN image_url text;
  END IF;
END $$;

-- Add image_url column to battery_groups table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'battery_groups' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE battery_groups ADD COLUMN image_url text;
  END IF;
END $$;

-- Create battery-images bucket if it doesn't exist
DO $$ 
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('battery-images', 'battery-images')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO storage.buckets (id, name)
  VALUES ('device-images', 'device-images')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on both buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Battery images policies
  DROP POLICY IF EXISTS "Users can upload battery images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their battery images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their battery images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view battery images" ON storage.objects;

  -- Device images policies
  DROP POLICY IF EXISTS "Users can upload device images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their device images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their device images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view device images" ON storage.objects;
END $$;

-- Create new policies for battery images
CREATE POLICY "Users can upload battery images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their battery images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their battery images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view battery images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'battery-images'
);

-- Create new policies for device images
CREATE POLICY "Users can upload device images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their device images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their device images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view device images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'device-images'
);