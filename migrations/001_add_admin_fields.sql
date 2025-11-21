-- Migration: Add Admin Plugin Fields to User Table
-- Date: 2024-11-21
-- Description: Adds banned, ban_reason, and ban_expires columns to support Better Auth admin plugin

-- Add banned column (default false)
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "banned" BOOLEAN DEFAULT false;

-- Add ban_reason column (optional text)
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "ban_reason" TEXT;

-- Add ban_expires column (optional timestamp)
ALTER TABLE "user"
ADD COLUMN IF NOT EXISTS "ban_expires" TIMESTAMP;

-- Update existing users to ensure they have banned = false
UPDATE "user"
SET "banned" = false
WHERE "banned" IS NULL;

-- Create index on banned column for faster queries
CREATE INDEX IF NOT EXISTS "user_banned_idx" ON "user"("banned");

-- Create index on role column for faster role-based queries
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user"("role");

-- Optional: Create a view for active (non-banned) users
CREATE OR REPLACE VIEW "active_users" AS
SELECT * FROM "user"
WHERE "banned" = false
   OR ("banned" = true AND "ban_expires" IS NOT NULL AND "ban_expires" < NOW());

-- Comments for documentation
COMMENT ON COLUMN "user"."banned" IS 'Indicates if user account is banned';
COMMENT ON COLUMN "user"."ban_reason" IS 'Reason provided when user was banned';
COMMENT ON COLUMN "user"."ban_expires" IS 'Timestamp when ban expires (NULL = permanent ban)';
COMMENT ON COLUMN "user"."role" IS 'User role: user, manager, or admin';
