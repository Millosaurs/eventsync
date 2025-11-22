# Scripts Directory

This directory contains utility scripts for the EventSync application.

## Available Scripts

### seed-events.ts

Seeds the database with sample events, teams, and team members for testing and development purposes.

#### What it does:

1. **Drops all existing events** (cascades to registrations)
2. **Drops all existing teams** (cascades to team members)
3. **Creates 5 teams** with various members:
   - Tech Innovators (3 members)
   - Code Warriors (4 members)
   - Startup Hustlers (2 members)
   - AI Pioneers (4 members)
   - DevOps Masters (3 members)

4. **Creates events in different states:**
   - **3 Expired Events** (already completed)
     - Summer Hackathon 2025 (Aug 15-17, 2025)
     - AI Workshop Series - Part 1 (Sep 20, 2025)
     - Startup Pitch Competition 2025 (Oct 5, 2025)
   
   - **2 Ongoing Events** (currently happening as of Nov 22, 2025)
     - Cloud Computing Summit 2025 (Nov 20-23, 2025)
     - GameDev Marathon (Nov 21-24, 2025)
   
   - **5 Upcoming Events** (scheduled for the future)
     - Cybersecurity Challenge 2025 (Dec 1-2, 2025)
     - Web3 & Blockchain Symposium (Dec 10-11, 2025)
     - Mobile App Development Workshop (Dec 15, 2025)
     - Data Science Bootcamp (Jan 10-14, 2026)
     - Tech Networking Mixer (Nov 29, 2025)
   
   - **1 Draft Event** (not yet published)
     - Robotics Competition 2026 (Feb 20-22, 2026)

5. **Registers teams to various events** to simulate real usage

#### Prerequisites:

- Database must be set up and accessible
- At least one user must exist in the database (the script will use the first available user as the event manager)
- Environment variables must be configured (`.env` file with `DATABASE_URL`)

#### Usage:

```bash
# Install dependencies first (if not already done)
npm install

# Run the seed script
npm run seed:events
```

#### Expected Output:

The script will output progress messages showing:
- Users found in the database
- Teams being created
- Members being added to teams
- Events being created (categorized by status)
- Team registrations

Example output:
```
🌱 Starting database seeding...
📋 Found 5 users in database
👤 Using manager: John Doe (john@example.com)
🗑️  Dropping all existing events...
✅ All events deleted
🗑️  Dropping all existing teams...
✅ All teams deleted
📅 Today's date: 2025-11-22T12:00:00.000Z

👥 Creating teams...
✅ Created team: Tech Innovators
...
✨ Database seeding completed successfully!

📊 Summary:
   - 5 teams created with members
   - 3 expired events (past)
   - 2 ongoing events (currently happening)
   - 5 upcoming events (future)
   - 1 draft event (not published)
   - Multiple team registrations
```

#### Notes:

- The script assumes today's date is **November 22, 2025** for determining event statuses
- All events are created with the `published` status except for the draft event
- Team members include both registered users and pending invitations
- Some registrations include check-in timestamps to simulate event attendance
- The script will exit with an error if no users are found in the database

#### Safety:

⚠️ **WARNING**: This script will **DELETE ALL EVENTS AND TEAMS** from the database before seeding. Only run this in development/testing environments!

## Other Scripts

### generate-qr-codes.ts

Generates QR codes for event registrations (see file for details).