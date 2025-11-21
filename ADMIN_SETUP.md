# Admin Plugin Setup - EventSync

## Overview

The Better Auth admin plugin has been successfully integrated into EventSync, enabling role-based access control with three distinct user roles: `user` (applicant), `manager` (event manager), and `admin` (administrator).

## Database Schema Changes

### User Table - New Columns

The following columns have been added to the `user` table to support the admin plugin:

```sql
-- Admin Plugin Fields
banned BOOLEAN DEFAULT FALSE
ban_reason TEXT
ban_expires TIMESTAMP
role TEXT DEFAULT 'user' NOT NULL
```

### Column Descriptions

- **`role`**: User's role in the system (user/manager/admin)
- **`banned`**: Boolean flag indicating if user is banned
- **`ban_reason`**: Optional text explaining why the user was banned
- **`ban_expires`**: Optional timestamp when the ban expires (null = permanent)

## Running Database Migrations

To apply these schema changes to your database, run:

```bash
# Generate migration files
bun run drizzle-kit generate

# Apply migrations to database
bun run drizzle-kit push
```

Or use the CLI directly:

```bash
bunx drizzle-kit push
```

## Configuration

### Server Configuration (`lib/auth.ts`)

```typescript
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    // ... other config
    plugins: [
        admin({
            defaultRole: "user",
        }),
    ],
});
```

### Client Configuration (`lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [adminClient()],
});
```

## Role-Based Dashboard

The dashboard (`/dashboard`) automatically detects the user's role and displays the appropriate view:

### 1. User/Applicant Dashboard (role: "user")
- View applied events
- Track application status
- See upcoming events
- Browse available events

### 2. Event Manager Dashboard (role: "manager")
- Create and manage events
- Review applications (Accept/Reject)
- View attendee lists
- Monitor event capacity
- Track recent activity

### 3. Admin Dashboard (role: "admin")
- System-wide statistics
- User management (all roles)
- System analytics
- Monitor system health
- Administrative actions (ban users, set roles, etc.)

## Admin API Endpoints

### Ban User
```typescript
POST /api/auth/admin/ban-user
{
  "userId": "user-id",
  "banReason": "Violation of terms",
  "banExpiresIn": 86400 // seconds (1 day)
}
```

### Unban User
```typescript
POST /api/auth/admin/unban-user
{
  "userId": "user-id"
}
```

### Set User Role
```typescript
POST /api/auth/admin/set-role
{
  "userId": "user-id",
  "role": "manager" // or "admin"
}
```

### Remove User Role
```typescript
POST /api/auth/admin/remove-role
{
  "userId": "user-id"
}
```

### Check User Permissions
```typescript
POST /api/auth/admin/has-permission
{
  "userId": "user-id",
  "permissions": {
    "user": ["ban", "unban"]
  }
}
```

## Using Admin Functions in Client

```typescript
import { authClient } from "@/lib/auth-client";

// Ban a user
await authClient.admin.banUser({
  userId: "user-123",
  banReason: "Spamming",
  banExpiresIn: 60 * 60 * 24 * 7, // 7 days
});

// Unban a user
await authClient.admin.unbanUser({
  userId: "user-123",
});

// Set user role
await authClient.admin.setRole({
  userId: "user-123",
  role: "manager",
});

// Remove user role
await authClient.admin.removeRole({
  userId: "user-123",
});
```

## Setting User Roles Manually (Database)

To manually set a user's role in the database:

```sql
-- Promote user to manager
UPDATE "user" SET role = 'manager' WHERE email = 'user@example.com';

-- Promote user to admin
UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com';

-- Ban a user
UPDATE "user" 
SET banned = true, 
    ban_reason = 'Violation of terms',
    ban_expires = NOW() + INTERVAL '7 days'
WHERE email = 'spammer@example.com';

-- Unban a user
UPDATE "user" 
SET banned = false, 
    ban_reason = NULL,
    ban_expires = NULL
WHERE email = 'user@example.com';
```

## Protected Routes

The dashboard automatically redirects unauthenticated users to `/auth`. You can protect other routes similarly:

```typescript
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  // Check role
  const userRole = session?.user.role;
  
  if (userRole !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

## Testing Roles

1. **Create a test admin user:**
   - Sign up normally at `/auth`
   - Manually update the database to set `role = 'admin'`
   - Refresh the dashboard to see admin view

2. **Create a test manager:**
   - Sign up normally at `/auth`
   - Use admin dashboard or SQL to set `role = 'manager'`
   - Access `/dashboard` to see manager view

3. **Test banning:**
   - Use admin functions to ban a user
   - Try signing in with that account
   - Should see "Account has been banned" message

## Security Notes

- Only users with `admin` role can access admin endpoints
- Banned users cannot sign in (all sessions are revoked)
- Role changes take effect immediately
- Always validate user roles on both client and server

## Next Steps

1. Run database migrations to apply schema changes
2. Create your first admin user via database
3. Test the dashboard with different roles
4. Implement additional role-based features as needed

## Troubleshooting

### "Model not found" errors
- Ensure `db/index.ts` exports the schema
- Verify schema is passed to drizzle adapter in `lib/auth.ts`

### Role not updating
- Clear browser cache and cookies
- Sign out and sign in again
- Check database to verify role value

### Dashboard not showing correct view
- Verify user.role in database
- Check browser console for errors
- Ensure admin plugin is properly configured

---

**Status:** ✅ Admin plugin fully configured
**Database:** Ready for migration
**Dashboards:** All three role views implemented