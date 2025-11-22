# Quick Start Guide: Running Event Feature

Get the running event feature up and running in 5 minutes!

## Prerequisites

- EventSync installed and running
- Database set up
- Node.js and npm installed

## 1. Install Dependencies

The QR code package should already be installed, but if not:

```bash
npm install qrcode @types/qrcode
```

## 2. Run Database Migration

Apply the new database schema:

```bash
# Option A: Using psql directly
psql $DATABASE_URL -f migrations/002_add_event_messages_and_attendance.sql

# Option B: Using your migration tool
npm run migrate
```

## 3. Set Up Resend (Email Service)

### Get Your API Key

1. Sign up at [https://resend.com](https://resend.com)
2. Go to Dashboard → API Keys
3. Create a new API key
4. Copy the key (starts with `re_`)

### Configure Environment Variables

Create or update `.env.local`:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here

# Email settings
EMAIL_FROM="EventSync <onboarding@resend.dev>"

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Replace `re_your_api_key_here` with your actual API key
- For production, use your own domain instead of `@resend.dev`
- Update `NEXT_PUBLIC_APP_URL` to your production URL when deploying

## 4. Restart Your Application

```bash
npm run dev
```

## 5. Test the Feature

### A. Create a Test Event

1. Log in as a manager/admin
2. Create a new event
3. Fill in event details
4. Set status to "running"

### B. Register a Team

1. Create or use an existing team
2. Add team members
3. Register the team for your test event

### C. Initialize QR Codes

Use an API client (Postman, curl, or Thunder Client):

```bash
POST http://localhost:3000/api/events/[YOUR_EVENT_ID]/initialize-qrcodes
Authorization: Bearer [YOUR_TOKEN]
```

This creates default QR codes for all registered teams:
- Event Attendance
- Lunch Coupon
- Dinner Coupon

### D. Send Notification Emails

```bash
POST http://localhost:3000/api/events/[YOUR_EVENT_ID]/notify-teams
Authorization: Bearer [YOUR_TOKEN]
```

This sends emails to all team members with links to their team portal.

### E. Access the Running Event Portal

Check your email or visit directly:
```
http://localhost:3000/running/[EVENT_ID]/[TEAM_ID]
```

### F. Post a Message

```bash
POST http://localhost:3000/api/events/[YOUR_EVENT_ID]/messages
Content-Type: application/json
Authorization: Bearer [YOUR_TOKEN]

{
  "title": "Welcome!",
  "content": "Thanks for joining the event. Check-in starts at 9 AM.",
  "priority": "normal"
}
```

## Key URLs

| Feature | URL Pattern |
|---------|-------------|
| Running Event Portal | `/running/[eventId]/[teamId]` |
| Event Messages | `/api/events/[id]/messages` |
| Team QR Codes | `/api/events/[id]/team/[teamId]/qrcodes` |
| Initialize QR Codes | `/api/events/[id]/initialize-qrcodes` |
| Send Notifications | `/api/events/[id]/notify-teams` |

## What You Get

✅ **Running Event Portal** - Dedicated page for each team with:
- Event details and location
- Rules and regulations
- Live updates from managers
- Team member list
- Team-specific QR codes
- Download QR codes as images

✅ **Event Messages** - Post real-time updates with priority levels:
- Urgent (red badge)
- High (orange badge)
- Normal (blue badge)
- Low (gray badge)

✅ **QR Code System** - Automatic tracking for:
- Event attendance
- Food coupon redemption
- Custom tracking items

✅ **Email Notifications** - Automatic emails to team members with:
- Event start notification
- Direct link to team portal
- Event details and instructions

## Common Commands

### Initialize QR Codes for All Teams
```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/initialize-qrcodes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Notifications to All Teams
```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/notify-teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Post a Message
```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Important Update",
    "content": "Schedule change: Session 2 moved to Room B",
    "priority": "high"
  }'
```

### Get Team QR Codes
```bash
curl http://localhost:3000/api/events/EVENT_ID/team/TEAM_ID/qrcodes
```

## Typical Manager Workflow

1. **Before Event:**
   - Create event
   - Accept team registrations
   - Initialize QR codes: `POST /api/events/[id]/initialize-qrcodes`

2. **Event Start:**
   - Change status to "running"
   - Send notifications: `POST /api/events/[id]/notify-teams`

3. **During Event:**
   - Post updates: `POST /api/events/[id]/messages`
   - Scan team QR codes for tracking
   - Monitor participation

4. **After Event:**
   - Review attendance data
   - Export reports

## Team Member Experience

1. **Receives Email** when event starts
2. **Clicks Link** to access team portal
3. **Views** event details, rules, and updates
4. **Shows QR Code** to staff for scanning
5. **Downloads QR Codes** for offline use

## Troubleshooting

### Emails not sending?
- Check `RESEND_API_KEY` in `.env.local`
- Verify API key is valid in Resend dashboard
- Check Resend logs at https://resend.com/logs

### QR codes not showing?
- Ensure `qrcode` package is installed: `npm install qrcode`
- Check browser console for errors
- Verify API returns data: `GET /api/events/[id]/team/[teamId]/qrcodes`

### Portal not loading?
- Verify event status is "running"
- Check team is registered for the event
- Verify URL has correct eventId and teamId

### Database errors?
- Ensure migration was run successfully
- Check database connection
- Verify tables exist: `event_message`, `attendance_tracking`

## Next Steps

📚 **Detailed Documentation:**
- [RUNNING_EVENT_FEATURE.md](./RUNNING_EVENT_FEATURE.md) - Complete feature documentation
- [RESEND_SETUP.md](./RESEND_SETUP.md) - Email setup guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

🎨 **Customization:**
- Modify email templates in `lib/email.ts`
- Customize portal UI in `app/running/[eventId]/[teamId]/page.tsx`
- Add custom QR tracking types

🚀 **Production:**
- Set up custom domain in Resend
- Update `EMAIL_FROM` to use your domain
- Set `NEXT_PUBLIC_APP_URL` to production URL
- Test all email flows before launch

## Need Help?

- Check [RUNNING_EVENT_FEATURE.md](./RUNNING_EVENT_FEATURE.md) for detailed docs
- Review [RESEND_SETUP.md](./RESEND_SETUP.md) for email troubleshooting
- Check Resend status: https://resend.com/status

---

**You're all set!** 🎉 The running event feature is ready to use.