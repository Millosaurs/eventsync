# EventSync API Documentation

This documentation provides details for integrating the EventSync REST APIs with Android Java applications.

## Base URL
```
https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a session token to be sent in the request headers or cookies. The authentication is handled via Better Auth session management.

### Headers
```
Cookie: better-auth.session_token=<your-session-token>
```

Or use the Authorization header (if configured):
```
Authorization: Bearer <your-session-token>
```

---

## API Endpoints

### 1. Get User Data

Fetches the current authenticated user's data including role information.

**Endpoint:** `GET /api/user`

**Authentication:** Required

**Request Example (Java):**
```java
// Using OkHttp
OkHttpClient client = new OkHttpClient();

Request request = new Request.Builder()
    .url("https://your-domain.com/api/user")
    .addHeader("Cookie", "better-auth.session_token=" + sessionToken)
    .get()
    .build();

Response response = client.newCall(request).execute();
String responseBody = response.body().string();
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_123abc",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "emailVerified": true,
    "image": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "banned": false,
    "banReason": null,
    "banExpires": null
  },
  "message": "User data fetched successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "data": null,
  "message": "Unauthorized. Please sign in.",
  "error": "UNAUTHORIZED"
}
```

**Java Model Classes:**
```java
public class UserResponse {
    private boolean success;
    private UserData data;
    private String message;
    private String error;
    
    // Getters and setters
}

public class UserData {
    private String id;
    private String name;
    private String email;
    private String role;
    private boolean emailVerified;
    private String image;
    private String createdAt;
    private String updatedAt;
    private boolean banned;
    private String banReason;
    private String banExpires;
    
    // Getters and setters
}
```

---

### 2. Get Events List

Fetches a paginated list of events with optional filtering and sorting.

**Endpoint:** `GET /api/events/list`

**Authentication:** Optional (but recommended for personalized results)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number for pagination |
| `limit` | integer | 10 | Number of events per page (max: 100) |
| `status` | string | - | Filter by status: `draft`, `published`, `cancelled` |
| `search` | string | - | Search in event title and description |
| `sortBy` | string | `createdAt` | Sort field: `createdAt`, `startDate`, `endDate`, `title` |
| `sortOrder` | string | `desc` | Sort order: `asc`, `desc` |
| `upcoming` | boolean | false | Filter only upcoming events |

**Request Example (Java):**
```java
// Using OkHttp
OkHttpClient client = new OkHttpClient();

HttpUrl.Builder urlBuilder = HttpUrl.parse("https://your-domain.com/api/events/list")
    .newBuilder();
urlBuilder.addQueryParameter("page", "1");
urlBuilder.addQueryParameter("limit", "20");
urlBuilder.addQueryParameter("status", "published");
urlBuilder.addQueryParameter("upcoming", "true");
urlBuilder.addQueryParameter("sortBy", "startDate");
urlBuilder.addQueryParameter("sortOrder", "asc");

Request request = new Request.Builder()
    .url(urlBuilder.build())
    .get()
    .build();

Response response = client.newCall(request).execute();
String responseBody = response.body().string();
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Tech Conference 2024",
        "description": "Annual technology conference featuring industry leaders",
        "imageUrl": "https://example.com/event-banner.jpg",
        "startDate": "2024-06-15T09:00:00.000Z",
        "endDate": "2024-06-15T18:00:00.000Z",
        "location": "Convention Center, New York",
        "maxCapacity": 500,
        "registrationDeadline": "2024-06-10T23:59:59.000Z",
        "status": "published",
        "managerId": "user_123abc",
        "teamId": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    }
  },
  "message": "Events fetched successfully"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "data": null,
  "message": "Failed to fetch events",
  "error": "INTERNAL_SERVER_ERROR"
}
```

**Java Model Classes:**
```java
public class EventsListResponse {
    private boolean success;
    private EventsData data;
    private String message;
    private String error;
    
    // Getters and setters
}

public class EventsData {
    private List<Event> events;
    private Pagination pagination;
    
    // Getters and setters
}

public class Event {
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private String startDate;
    private String endDate;
    private String location;
    private Integer maxCapacity;
    private String registrationDeadline;
    private String status;
    private String managerId;
    private String teamId;
    private String createdAt;
    private String updatedAt;
    
    // Getters and setters
}

public class Pagination {
    private int page;
    private int limit;
    private int total;
    private int totalPages;
    private boolean hasMore;
    
    // Getters and setters
}
```

---

### 3. Get Single Event

Fetches detailed information about a specific event by ID.

**Endpoint:** `GET /api/events/{id}`

**Authentication:** Optional

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | The unique identifier of the event |

**Request Example (Java):**
```java
// Using OkHttp
OkHttpClient client = new OkHttpClient();

String eventId = "550e8400-e29b-41d4-a716-446655440000";

Request request = new Request.Builder()
    .url("https://your-domain.com/api/events/" + eventId)
    .get()
    .build();

Response response = client.newCall(request).execute();
String responseBody = response.body().string();
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference featuring industry leaders",
    "imageUrl": "https://example.com/event-banner.jpg",
    "startDate": "2024-06-15T09:00:00.000Z",
    "endDate": "2024-06-15T18:00:00.000Z",
    "location": "Convention Center, New York",
    "maxCapacity": 500,
    "registrationDeadline": "2024-06-10T23:59:59.000Z",
    "status": "published",
    "managerId": "user_123abc",
    "teamId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Event fetched successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "data": null,
  "message": "Event not found",
  "error": "NOT_FOUND"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid event ID format",
  "error": "INVALID_ID"
}
```

**Java Model Classes:**
```java
public class EventResponse {
    private boolean success;
    private Event data;
    private String message;
    private String error;
    
    // Getters and setters
}

// Event class is the same as defined above
```

---

### 4. Create Event

Creates a new event in the system.

**Endpoint:** `POST /api/events/create`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring industry leaders",
  "imageUrl": "https://example.com/event-banner.jpg",
  "maxCapacity": 500,
  "startDate": "2024-06-15T09:00:00.000Z",
  "endDate": "2024-06-15T18:00:00.000Z",
  "location": "Convention Center, New York",
  "registrationDeadline": "2024-06-10T23:59:59.000Z",
  "status": "draft"
}
```

**Required Fields:**
- `title` (string)
- `description` (string)
- `startDate` (ISO 8601 datetime string)
- `endDate` (ISO 8601 datetime string)
- `location` (string)
- `registrationDeadline` (ISO 8601 datetime string)

**Optional Fields:**
- `imageUrl` (string, nullable)
- `maxCapacity` (integer, nullable)
- `status` (string, default: "draft")

**Request Example (Java):**
```java
// Using OkHttp
OkHttpClient client = new OkHttpClient();
MediaType JSON = MediaType.get("application/json; charset=utf-8");

JSONObject json = new JSONObject();
json.put("title", "Tech Conference 2024");
json.put("description", "Annual technology conference");
json.put("imageUrl", "https://example.com/banner.jpg");
json.put("maxCapacity", 500);
json.put("startDate", "2024-06-15T09:00:00.000Z");
json.put("endDate", "2024-06-15T18:00:00.000Z");
json.put("location", "Convention Center, New York");
json.put("registrationDeadline", "2024-06-10T23:59:59.000Z");
json.put("status", "draft");

RequestBody body = RequestBody.create(json.toString(), JSON);

Request request = new Request.Builder()
    .url("https://your-domain.com/api/events/create")
    .addHeader("Cookie", "better-auth.session_token=" + sessionToken)
    .post(body)
    .build();

Response response = client.newCall(request).execute();
String responseBody = response.body().string();
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "event": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "imageUrl": "https://example.com/banner.jpg",
    "startDate": "2024-06-15T09:00:00.000Z",
    "endDate": "2024-06-15T18:00:00.000Z",
    "location": "Convention Center, New York",
    "maxCapacity": 500,
    "registrationDeadline": "2024-06-10T23:59:59.000Z",
    "status": "draft",
    "managerId": "user_123abc",
    "teamId": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Event created successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized. Please sign in."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields"
}
```

**Java Model Classes:**
```java
public class CreateEventRequest {
    private String title;
    private String description;
    private String imageUrl;
    private Integer maxCapacity;
    private String startDate;
    private String endDate;
    private String location;
    private String registrationDeadline;
    private String status;
    
    // Getters and setters
}

public class CreateEventResponse {
    private boolean success;
    private Event event;
    private String message;
    private String error;
    
    // Getters and setters
}
```

---

## Complete Android Integration Example

### Using Retrofit

**1. Add Dependencies (build.gradle):**
```gradle
implementation 'com.squareup.retrofit2:retrofit:2.9.0'
implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
```

**2. Create API Interface:**
```java
public interface EventSyncApi {
    
    @GET("user")
    Call<UserResponse> getUser();
    
    @GET("events/list")
    Call<EventsListResponse> getEvents(
        @Query("page") Integer page,
        @Query("limit") Integer limit,
        @Query("status") String status,
        @Query("search") String search,
        @Query("sortBy") String sortBy,
        @Query("sortOrder") String sortOrder,
        @Query("upcoming") Boolean upcoming
    );
    
    @GET("events/{id}")
    Call<EventResponse> getEvent(@Path("id") String id);
    
    @POST("events/create")
    Call<CreateEventResponse> createEvent(@Body CreateEventRequest request);
}
```

**3. Create Retrofit Instance:**
```java
public class ApiClient {
    private static final String BASE_URL = "https://your-domain.com/api/";
    private static Retrofit retrofit = null;
    
    public static Retrofit getClient(String sessionToken) {
        OkHttpClient.Builder httpClient = new OkHttpClient.Builder();
        
        // Add session token to all requests
        if (sessionToken != null) {
            httpClient.addInterceptor(chain -> {
                Request original = chain.request();
                Request request = original.newBuilder()
                    .header("Cookie", "better-auth.session_token=" + sessionToken)
                    .build();
                return chain.proceed(request);
            });
        }
        
        // Add logging interceptor for debugging
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);
        httpClient.addInterceptor(logging);
        
        retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .client(httpClient.build())
            .build();
            
        return retrofit;
    }
}
```

**4. Make API Calls:**
```java
// Get user data
EventSyncApi api = ApiClient.getClient(sessionToken).create(EventSyncApi.class);

Call<UserResponse> call = api.getUser();
call.enqueue(new Callback<UserResponse>() {
    @Override
    public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
        if (response.isSuccessful() && response.body() != null) {
            UserResponse userResponse = response.body();
            if (userResponse.isSuccess()) {
                UserData user = userResponse.getData();
                Log.d("API", "User: " + user.getName() + ", Role: " + user.getRole());
            }
        }
    }
    
    @Override
    public void onFailure(Call<UserResponse> call, Throwable t) {
        Log.e("API", "Error: " + t.getMessage());
    }
});

// Get events list
Call<EventsListResponse> eventsCall = api.getEvents(1, 20, "published", null, "startDate", "asc", true);
eventsCall.enqueue(new Callback<EventsListResponse>() {
    @Override
    public void onResponse(Call<EventsListResponse> call, Response<EventsListResponse> response) {
        if (response.isSuccessful() && response.body() != null) {
            EventsListResponse eventsResponse = response.body();
            if (eventsResponse.isSuccess()) {
                List<Event> events = eventsResponse.getData().getEvents();
                // Update UI with events
            }
        }
    }
    
    @Override
    public void onFailure(Call<EventsListResponse> call, Throwable t) {
        Log.e("API", "Error: " + t.getMessage());
    }
});
```

---

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 200 | - | Success |
| 201 | - | Created successfully |
| 400 | INVALID_ID | Invalid ID format |
| 400 | BAD_REQUEST | Missing or invalid request parameters |
| 401 | UNAUTHORIZED | Authentication required or invalid session |
| 404 | NOT_FOUND | Resource not found |
| 500 | INTERNAL_SERVER_ERROR | Server error occurred |

---

## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": "ERROR_CODE"
}
```

---

## Date/Time Format

All date and time values use ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

Example: `2024-06-15T09:00:00.000Z`

---

## Best Practices

1. **Always check the `success` field** before accessing `data`
2. **Handle network errors** gracefully with proper error messages
3. **Cache session tokens** securely using Android's EncryptedSharedPreferences
4. **Implement retry logic** for network failures
5. **Use pagination** for large data sets to improve performance
6. **Validate data** on the client side before sending to the API
7. **Handle 401 errors** by redirecting to login screen
8. **Log API errors** for debugging purposes

---

## Support

For issues or questions, please contact the development team or refer to the main project documentation.