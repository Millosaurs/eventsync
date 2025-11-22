# Manager Registration Flow Documentation

## Overview

The Manager Registration Flow allows regular users to apply for manager access, which grants them the ability to create and manage events. Applications are reviewed by administrators who can approve or reject them.

## Architecture

### Database Schema

#### `manager_applications` Table
- `id` (UUID): Primary key
- `userId` (TEXT): Foreign key to user table
- `organizationName` (TEXT): Name of the organization
- `organizationType` (TEXT): Type of organization (corporate, nonprofit, educational, etc.)
- `contactPhone` (TEXT): Contact phone number
- `website` (TEXT, optional): Organization website
- `description` (TEXT): Organization description and purpose
- `experience` (TEXT): Event management experience
- `status` (TEXT): Application status (pending, approved, rejected)
- `adminNotes` (TEXT, optional): Admin feedback/notes
- `reviewedBy` (TEXT, optional): Admin who reviewed the application
- `reviewedAt` (TIMESTAMP, optional): When the application was reviewed
- `createdAt` (TIMESTAMP): When the application was created
- `updatedAt` (TIMESTAMP): Last update timestamp

### API Endpoints

#### 1. Submit Manager Application
**Endpoint**: `POST /api/manager-applications/submit`

**Request Body**:
```json
{
  "organizationName": "string",
  "organizationType": "string",
  "contactPhone": "string",
  "website": "string (optional)",
  "description": "string",
  "experience": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "string",
    "organizationName": "string",
    "organizationType": "string",
    "contactPhone": "string",
    "website": "string",
    "description": "string",
    "experience": "string",
    "status": "pending",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "message": "Application submitted successfully."
}
```

**Validations**:
- User must be authenticated
- User cannot already be a manager or admin
- User cannot have an existing pending application
- All required fields must be provided

#### 2. Get User's Application Status
**Endpoint**: `GET /api/manager-applications/submit`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending | approved | rejected",
    "organizationName": "string",
    "adminNotes": "string (optional)",
    "createdAt": "timestamp",
    "reviewedAt": "timestamp (optional)"
  },
  "message": "Application found."
}
```

#### 3. Get All Applications (Admin Only)
**Endpoint**: `GET /api/manager-applications/admin?status={status}`

**Query Parameters**:
- `status`: "pending" | "approved" | "rejected" | "all" (default: "pending")

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "string",
      "organizationName": "string",
      "organizationType": "string",
      "contactPhone": "string",
      "website": "string",
      "description": "string",
      "experience": "string",
      "status": "string",
      "adminNotes": "string",
      "reviewedBy": "string",
      "reviewedAt": "timestamp",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }
  ],
  "message": "Found X applications."
}
```

**Authorization**: Admin role required

#### 4. Approve/Reject Application (Admin Only)
**Endpoint**: `PATCH /api/manager-applications/admin`

**Request Body**:
```json
{
  "applicationId": "uuid",
  "action": "approve | reject",
  "adminNotes": "string (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved | rejected",
    "adminNotes": "string",
    "reviewedBy": "string",
    "reviewedAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "message": "Application approved/rejected successfully."
}
```

**Side Effects**:
- When approved: User's role is updated to "manager" in the database
- When rejected: No role change occurs

**Authorization**: Admin role required

## User Flow

### For Regular Users

1. **Access Application Page**
   - Navigate to `/apply-manager` from dashboard or header
   - Or click "Apply for Manager Access" button on user dashboard

2. **Fill Application Form**
   - Organization Name (required)
   - Organization Type (required): Corporate, Non-Profit, Educational, Government, Community, Individual, Other
   - Contact Phone (required)
   - Website (optional)
   - Organization Description (required)
   - Event Management Experience (required)

3. **Submit Application**
   - Application is created with "pending" status
   - User sees confirmation message

4. **Track Application Status**
   - Return to `/apply-manager` to view application status
   - Status can be: Pending, Approved, or Rejected
   - If rejected, admin notes are displayed
   - If rejected, user can apply again

5. **Access Manager Features**
   - Once approved, user role is automatically updated to "manager"
   - User needs to refresh or re-login to access manager features
   - Can now create and manage events

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin` from header or dashboard
   - Only accessible to users with "admin" role

2. **View Applications**
   - See dashboard with statistics:
     - Pending applications count
     - Approved applications count
     - Rejected applications count
   - Filter by status using tabs: Pending, Approved, Rejected, All

3. **Review Application**
   - Click "View" to see full application details
   - Review:
     - Applicant information (name, email)
     - Organization details
     - Description and experience

4. **Approve or Reject**
   - Click "Approve" or "Reject" button
   - Optionally add admin notes for feedback
   - Confirm action
   - User's role is automatically updated if approved

## Frontend Components

### Pages

1. **`/apply-manager`** (`app/apply-manager/page.tsx`)
   - Application form for regular users
   - Displays application status if one exists
   - Shows appropriate messages based on user role and application status

2. **`/admin`** (`app/admin/page.tsx`)
   - Admin panel for managing applications
   - Tables with filtering and sorting
   - Application review dialog

### Dashboard Integration

1. **User Dashboard** (`app/dashboard/page.tsx`)
   - Shows "Want to Create Events?" card with call-to-action
   - Links to `/apply-manager`

2. **Admin Dashboard** (`app/dashboard/page.tsx`)
   - Shows "Manager Applications" button in Quick Actions
   - Links to `/admin`

### Header Navigation

- Regular users: "Apply Manager" link in header
- Admins: "Admin Panel" link in header

## Security & Permissions

### Role-Based Access Control

1. **User Role**:
   - Can submit one application at a time
   - Cannot submit if already a manager or admin
   - Can view own application status
   - Cannot access admin routes

2. **Manager Role**:
   - Cannot submit applications
   - Redirected with message if accessing `/apply-manager`
   - Cannot access admin routes

3. **Admin Role**:
   - Can view all applications
   - Can approve/reject applications
   - Can add notes to applications
   - Has access to admin panel

### API Security

- All endpoints require authentication
- Session validation using Better Auth
- Role checks on protected routes
- Foreign key constraints ensure data integrity

## Database Relations

```
user
  └── manager_applications (one-to-many)
      └── reviewedBy -> user (many-to-one)
```

## Status Flow

```
User submits application
    ↓
Status: "pending"
    ↓
Admin reviews
    ↓
    ├── Approve → Status: "approved" + User role updated to "manager"
    │
    └── Reject → Status: "rejected" (User can apply again)
```

## Error Handling

### Common Errors

1. **UNAUTHORIZED** (401): User not logged in
2. **FORBIDDEN** (403): User lacks required permissions
3. **VALIDATION_ERROR** (400): Missing required fields or invalid data
4. **APPLICATION_EXISTS** (400): User already has a pending application
5. **ALREADY_ELEVATED** (400): User already has manager/admin role
6. **NOT_FOUND** (404): Application not found
7. **ALREADY_PROCESSED** (400): Application already approved/rejected

## Testing Scenarios

### User Application Flow
1. ✓ User can submit application with valid data
2. ✓ User cannot submit without required fields
3. ✓ User cannot submit multiple pending applications
4. ✓ Manager/Admin cannot submit applications
5. ✓ User can view their application status
6. ✓ User can reapply after rejection

### Admin Review Flow
1. ✓ Admin can view all applications
2. ✓ Admin can filter by status
3. ✓ Admin can approve applications
4. ✓ Admin can reject applications
5. ✓ Admin can add notes
6. ✓ User role updates on approval
7. ✓ Non-admin cannot access admin routes

## Migration

Run the following to apply the database schema:

```bash
npx drizzle-kit push
```

Or run the migration file directly:

```sql
-- See drizzle/0001_manager_applications.sql
```

## Future Enhancements

1. **Email Notifications**
   - Notify users when application is reviewed
   - Notify admins of new applications

2. **Bulk Actions**
   - Approve/reject multiple applications at once

3. **Application Comments**
   - Allow back-and-forth communication between admin and applicant

4. **Analytics Dashboard**
   - Track approval rates
   - Average review time
   - Popular organization types

5. **Document Upload**
   - Allow users to upload supporting documents
   - Verification documents for organizations

6. **Application History**
   - Track all application attempts
   - Show revision history

## Troubleshooting

### User can't see manager features after approval
- User needs to refresh the page or log out and log back in
- Check that user role is actually "manager" in database
- Verify session is updated

### Applications not showing in admin panel
- Check user has "admin" role
- Verify database connection
- Check API response for errors

### Application submission fails
- Verify all required fields are filled
- Check for existing pending applications
- Ensure user is authenticated
- Check API logs for detailed error messages