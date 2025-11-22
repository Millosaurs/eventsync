-- Create event_message table
CREATE TABLE IF NOT EXISTS "event_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"manager_id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create attendance_tracking table
CREATE TABLE IF NOT EXISTS "attendance_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"tracking_type" text NOT NULL,
	"label" text NOT NULL,
	"scanned_at" timestamp,
	"scanned_by" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign keys for event_message
DO $$ BEGIN
 ALTER TABLE "event_message" ADD CONSTRAINT "event_message_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "event_message" ADD CONSTRAINT "event_message_manager_id_user_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add foreign keys for attendance_tracking
DO $$ BEGIN
 ALTER TABLE "attendance_tracking" ADD CONSTRAINT "attendance_tracking_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "attendance_tracking" ADD CONSTRAINT "attendance_tracking_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "attendance_tracking" ADD CONSTRAINT "attendance_tracking_scanned_by_user_id_fk" FOREIGN KEY ("scanned_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "event_message_event_id_idx" ON "event_message" ("event_id");
CREATE INDEX IF NOT EXISTS "event_message_created_at_idx" ON "event_message" ("created_at");
CREATE INDEX IF NOT EXISTS "attendance_tracking_event_id_idx" ON "attendance_tracking" ("event_id");
CREATE INDEX IF NOT EXISTS "attendance_tracking_team_id_idx" ON "attendance_tracking" ("team_id");
CREATE INDEX IF NOT EXISTS "attendance_tracking_event_team_idx" ON "attendance_tracking" ("event_id", "team_id");
