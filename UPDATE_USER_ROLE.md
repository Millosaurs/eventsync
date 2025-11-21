# Update User Role to Manager or Admin

If you can't access the page designer, you need to update your user role in the database to either `manager` or `admin`.

## Option 1: Using Database GUI (Recommended)

If you're using a database GUI tool like pgAdmin, DBeaver, or TablePlus:

1. Connect to your PostgreSQL database
2. Navigate to the `user` table
3. Find your user record (search by email)
4. Update the `role` column from `user` to `manager` or `admin`
5. Save the changes
6. Refresh your browser and log out/log in

## Option 2: Using SQL Query

Run this SQL query in your database:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE "user" 
SET role = 'manager' 
WHERE email = 'your-email@example.com';
```

Or to make yourself an admin:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE "user" 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Option 3: Using Drizzle Studio (If Available)

```bash
# Open Drizzle Studio
npx drizzle-kit studio

# Then:
# 1. Navigate to the 'user' table
# 2. Find your user
# 3. Edit the 'role' field to 'manager' or 'admin'
# 4. Save changes
```

## Option 4: Using Node.js Script

Create a file `update-role.js` in your project root:

```javascript
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { user } = require('./db/schema');
const { eq } = require('drizzle-orm');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

async function updateUserRole(email, role) {
  await db.update(user)
    .set({ role })
    .where(eq(user.email, email));
  
  console.log(`Updated ${email} to ${role}`);
  process.exit(0);
}

// Replace with your email
updateUserRole('your-email@example.com', 'manager');
```

Then run:
```bash
node update-role.js
```

## Verify Your Role

After updating your role:

1. Log out of the application
2. Log back in
3. Navigate to any event page
4. You should now see the "Customize Page" button next to "About This Event"
5. Click it to access the page designer

## Available Roles

- **`user`** (default) - Regular users, can register for events
- **`manager`** - Event managers, can create events and customize event pages
- **`admin`** - Administrators, full access to all features

## Troubleshooting

If you still can't access the designer after updating your role:

1. **Clear browser cache and cookies**
2. **Verify the role was updated:**
   ```sql
   SELECT email, role FROM "user" WHERE email = 'your-email@example.com';
   ```
3. **Check the browser console** for any JavaScript errors
4. **Log out and log back in** to refresh the session
5. **Verify you're logged in** - check the header for user info

## Security Note

⚠️ **Important:** Only give manager/admin roles to trusted users, as they will have elevated permissions including:
- Creating and managing events
- Customizing event pages
- Accessing the page designer
- Viewing event analytics (future feature)