# Authentication Setup Guide for EventSync

## Issues Fixed

1. ✅ Added `baseURL` configuration to auth client
2. ✅ Enabled email/password authentication in Better Auth
3. ✅ Renamed API route file from `routes.ts` to `route.ts` (Next.js requirement)
4. ✅ Added proper error handling and toast notifications
5. ✅ Fixed all TypeScript errors and warnings

## Environment Variables Required

Make sure your `.env` file contains the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/eventsync

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-secret-key-here

# Google OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How to Generate BETTER_AUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `BETTER_AUTH_SECRET` value.

## Database Setup

1. Make sure your PostgreSQL database is running
2. Run migrations to create the required tables:
   ```bash
   npm run db:push
   # or if you're using Bun
   bun run db:push
   ```

## Why You Were Getting 404 Errors

### Issue 1: Missing API Route File Name
- **Problem**: The file was named `routes.ts` instead of `route.ts`
- **Fix**: Renamed to `route.ts` (Next.js App Router requires singular naming)
- **Location**: `app/api/auth/[...all]/route.ts`

### Issue 2: Missing baseURL in Auth Client
- **Problem**: The auth client didn't know where to send API requests
- **Fix**: Added `baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"`
- **Location**: `lib/auth-client.ts`

### Issue 3: Email/Password Authentication Not Enabled
- **Problem**: Better Auth requires explicit enablement of email/password auth
- **Fix**: Added `emailAndPassword: { enabled: true }` to auth config
- **Location**: `lib/auth.ts`

### Issue 4: Missing baseURL in Auth Server
- **Problem**: The server didn't know its own URL for callbacks
- **Fix**: Added `baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000"`
- **Location**: `lib/auth.ts`

## Testing the Authentication

### Sign Up Flow
1. Navigate to the sign-up page
2. Enter your details:
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
3. Click "Create an account"
4. You should see a success toast and be redirected to `/dashboard`

### Sign In Flow
1. Navigate to the sign-in page
2. Enter your email and password
3. Optionally check "Remember me"
4. Click "Login"
5. You should see a success toast and be redirected to `/dashboard`

## Toast Notifications

The app now uses Coss UI toast notifications instead of Sonner:

```typescript
import { toastManager } from "@/components/ui/toast";

// Success toast
toastManager.add({
  title: "Success",
  description: "Your action was completed",
  type: "success",
});

// Error toast
toastManager.add({
  title: "Error",
  description: "Something went wrong",
  type: "error",
});

// Info toast
toastManager.add({
  title: "Info",
  description: "Here's some information",
  type: "info",
});

// Warning toast
toastManager.add({
  title: "Warning",
  description: "Please be careful",
  type: "warning",
});

// Loading toast
toastManager.add({
  title: "Loading",
  description: "Please wait...",
  type: "loading",
});
```

## Troubleshooting

### Still getting 404 errors?

1. **Check your environment variables**:
   ```bash
   # In your .env file, make sure these are set:
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

2. **Restart your development server**:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   # or
   bun run dev
   ```

3. **Check the API route exists**:
   - File should be at: `app/api/auth/[...all]/route.ts`
   - Check that it exports `GET` and `POST`

4. **Check database connection**:
   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running
   - Test connection: `psql $DATABASE_URL`

### Can't sign in after sign up?

1. **Check if email verification is required**:
   - By default, email verification is disabled
   - If you enabled it, you need to implement `sendVerificationEmail`

2. **Check password requirements**:
   - Minimum 8 characters
   - Maximum 128 characters (default)

3. **Check browser console for errors**:
   - Open DevTools (F12)
   - Look for network errors in