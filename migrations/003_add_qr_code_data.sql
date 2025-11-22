-- Add qr_code_data column to attendance_tracking table
ALTER TABLE "attendance_tracking" ADD COLUMN IF NOT EXISTS "qr_code_data" text;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS "attendance_tracking_qr_code_data_idx" ON "attendance_tracking" ("qr_code_data");

-- Add comment for documentation
COMMENT ON COLUMN "attendance_tracking"."qr_code_data" IS 'Stores the QR code data URL (image/png base64) for consistent QR code display';
