-- Migration: Add member_id column to attendance_tracking table
-- This allows QR codes to be generated per team member instead of per team

-- Add member_id column (nullable to support existing records)
ALTER TABLE attendance_tracking
ADD COLUMN member_id UUID REFERENCES team_member(id) ON DELETE CASCADE;

-- Add comment to describe the column
COMMENT ON COLUMN attendance_tracking.member_id IS 'Optional: links QR code to specific team member for personalized coupons';

-- Create index for faster queries by member
CREATE INDEX idx_attendance_tracking_member_id ON attendance_tracking(member_id);

-- Create composite index for common query patterns
CREATE INDEX idx_attendance_tracking_event_team_member ON attendance_tracking(event_id, team_id, member_id);
