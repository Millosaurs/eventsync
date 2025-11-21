# EventSync API Quick Reference

Quick reference guide for REST API endpoints.

## Base URL
```
https://your-domain.com/api
```

## Authentication
Add session token to requests:
```
Cookie: better-auth.session_token=<token>
```

---

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/user` | ✅ Yes | Get current user data with role |
| GET | `/api/events/list` | ❌ No | Get paginated events list |
| GET | `/api/events/{id}` | ❌ No | Get single event by ID |
| POST | `/api/events/create` | ✅ Yes | Create new event |

---

## 1. Get User Data

**GET** `/api/user`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "emailVerified": true,
    "image": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "banned": false,
    "banReason": null,
    "banExpires": null
  },
  "message": "User data fetched successfully"
}
```

---

## 2. Get Events List

**GET** `/api/events/list?page=1&limit=10`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (draft/published/cancelled)
- `search` - Search in title/description
- `sortBy` - Sort field (createdAt/startDate/endDate/title)
- `sortOrder` - Sort direction (asc/desc)
- `upcoming` - Show only upcoming events (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Tech Conference 2024",
        "description": "Annual tech conference",
        "imageUrl": "https://...",
        "startDate": "2024-06-15T09:00:00.000Z",
        "endDate": "2024-06-15T18:00:00.000Z",
        "location": "Convention Center, NY",
        "maxCapacity": 500,
        "registrationDeadline": "2024-06-10T23:59:59.000Z",
        "status": "published",
        "managerId": "user_123",
        "teamId": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasMore": true
    }
  },
  "message": "Events fetched successfully"
}
```

---

## 3. Get Single Event

**GET** `/api/events/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tech Conference 2024",
    "description": "Annual tech conference",
    "imageUrl": "https://...",
    "startDate": "2024-06-15T09:00:00.000Z",
    "endDate": "2024-06-15T18:00:00.000Z",
    "location": "Convention Center, NY",
    "maxCapacity": 500,
    "registrationDeadline": "2024-06-10T23:59:59.000Z",
    "status": "published",
    "managerId": "user_123",
    "teamId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Event fetched successfully"
}
```

---

## 4. Create Event

**POST** `/api/events/create`

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "imageUrl": "https://...",
  "maxCapacity": 500,
  "startDate": "2024-06-15T09:00:00.000Z",
  "endDate": "2024-06-15T18:00:00.000Z",
  "location": "Convention Center, NY",
  "registrationDeadline": "2024-06-10T23:59:59.000Z",
  "status": "draft"
}
```

**Required Fields:**
- `title`
- `description`
- `startDate`
- `endDate`
- `location`
- `registrationDeadline`

**Optional Fields:**
- `imageUrl`
- `maxCapacity`
- `status` (default: "draft")

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tech Conference 2024",
    ...
  },
  "message": "Event created successfully"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401) - Not authenticated
- `INVALID_ID` (400) - Invalid UUID format
- `NOT_FOUND` (404) - Resource not found
- `BAD_REQUEST` (400) - Missing/invalid parameters
- `INTERNAL_SERVER_ERROR` (500) - Server error

---

## cURL Examples

**Get User:**
```bash
curl -X GET "https://your-domain.com/api/user" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"
```

**Get Events:**
```bash
curl -X GET "https://your-domain.com/api/events/list?page=1&limit=20&upcoming=true"
```

**Get Single Event:**
```bash
curl -X GET "https://your-domain.com/api/events/550e8400-e29b-41d4-a716-446655440000"
```

**Create Event:**
```bash
curl -X POST "https://your-domain.com/api/events/create" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "Annual tech conference",
    "startDate": "2024-06-15T09:00:00.000Z",
    "endDate": "2024-06-15T18:00:00.000Z",
    "location": "Convention Center",
    "registrationDeadline": "2024-06-10T23:59:59.000Z"
  }'
```

---

## Date Format

All dates use ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

Example: `2024-06-15T09:00:00.000Z`

---

## Response Structure

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "message": "...",
  "error": "ERROR_CODE"
}
```

---

For complete documentation with Android/Java examples, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)