# System Architecture

## Architecture Overview

The system follows a **fullstack monorepo pattern** with clear separation of concerns:
- **Frontend (Client)**: Next.js 16 with App Router, handles UI and user interactions
- **Backend (Server)**: Fastify 4 with TypeScript, handles business logic and data persistence
- **Communication**: REST API with BFF (Backend-For-Frontend) proxy pattern
- **Data Storage**: SQLite with Prisma ORM

---

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Web Browser                            │
│                  (User's Computer)                          │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
                  ↓
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (port 3000)                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ React Components (UI Layer)                         │   │
│  │ - LoginForm, ProductList, ProductDetail             │   │
│  │ - Header, Footer, Navigation                        │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ SWR + React Query (Data Fetching & Caching)        │   │
│  │ - Automatic deduplication within 2s window         │   │
│  │ - Background revalidation                          │   │
│  │ - Fallback data from server                        │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Zustand State Store (Auth & UI State)              │   │
│  │ - User login status                                │   │
│  │ - Current user profile                             │   │
│  │ - Modal visibility & UI flags                      │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ BFF API Routes (/api/*)                            │   │
│  │ - /api/proxy/[...path] - Generic proxy             │   │
│  │ - /api/auth/* - Auth handling                      │   │
│  │ - Token refresh, request decoration                │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Fetch Client Library                               │   │
│  │ - Request/response transformation                  │   │
│  │ - Error interceptors                               │   │
│  │ - Authorization header injection                   │   │
│  └────────────────────┬────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │ HTTP
                      ↓
┌─────────────────────────────────────────────────────────────┐
│            Fastify Backend (port 8080)                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ HTTP Request Handler Layer                          │   │
│  │ - Route definitions & hooks                        │   │
│  │ - Zod schema validation                            │   │
│  │ - Request/response serialization                   │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Middleware & Plugins                               │   │
│  │ - Helmet: Security headers                         │   │
│  │ - Auth: JWT decode & validation                    │   │
│  │ - Multipart: File upload handling                  │   │
│  │ - Cookie: Session token management                 │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Pre-Route Hooks                                     │   │
│  │ - require-authed-hook: Auth validation             │   │
│  │ - Attaches Account object to request               │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Controllers (Business Logic Layer)                 │   │
│  │ - AuthController: register, login, logout          │   │
│  │ - AccountController: profile get/update            │   │
│  │ - ProductController: CRUD operations               │   │
│  │ - MediaController: image upload/serve              │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │ Prisma ORM (Data Abstraction Layer)                │   │
│  │ - Account model operations                         │   │
│  │ - Session model operations                         │   │
│  │ - Product model operations                         │   │
│  │ - Connection pooling                               │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                      │
└─────────────────────┼──────────────────────────────────────┘
                      │ SQL
                      ↓
┌─────────────────────────────────────────────────────────────┐
│         SQLite Database (file: dev.db)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Account Table                                      │   │
│  │ - id (PK): string                                 │   │
│  │ - email (UNIQUE): string                          │   │
│  │ - name: string (nullable)                         │   │
│  │ - password: string (bcrypt hashed)                │   │
│  │ - createdAt, updatedAt                            │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Session Table                                      │   │
│  │ - token (PK): string                              │   │
│  │ - accountId (FK): string                          │   │
│  │ - expiresAt: datetime                             │   │
│  │ - createdAt                                       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Product Table                                      │   │
│  │ - id (PK): string                                 │   │
│  │ - name: string                                    │   │
│  │ - description: string (nullable)                  │   │
│  │ - price: float                                    │   │
│  │ - image: string (nullable, URL)                   │   │
│  │ - accountId (FK): string (product owner)          │   │
│  │ - createdAt, updatedAt                            │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │ File System (Uploaded Images)                     │   │
│  │ - /uploads/[imageId]                              │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow

### Authentication Flow: User Registration

```
User Input: Register Form
    │
    ├─ Form Validation (React Hook Form + Zod)
    │
    ├─ HTTP POST /api/auth/register
    │
    ├─ BFF Handler: /api/auth/register
    │   ├─ Request decoration
    │   ├─ Request ID generation (x-request-id header)
    │   └─ Forward to backend
    │
    ├─ Fastify POST /auth/register
    │   ├─ Zod schema validation
    │   ├─ Call AuthController.register()
    │       ├─ Hash password with bcrypt
    │       ├─ Check email uniqueness
    │       ├─ Create Account in database
    │       └─ Return success response
    │   └─ Return 200 + token
    │
    ├─ BFF Handler: Receive response
    │   ├─ Validate response against Zod schema
    │   ├─ Set HttpOnly sessionToken cookie
    │   └─ Return 200 to client
    │
    ├─ Client: Receive response
    │   ├─ Store token in Zustand
    │   ├─ Redirect to home page
    │   └─ Update UI (show user as logged in)
    │
    └─ AuthInitializer: On mount
        ├─ Call /api/auth/me to validate session
        ├─ Hydrate Zustand with user profile
        └─ Render protected content
```

### Data Fetching Flow: Product Listing

```
Server Component (RSC): page.tsx
    │
    ├─ Calls api/server.ts (direct backend call)
    │
    ├─ Fastify GET /products
    │   ├─ No auth required (public endpoint)
    │   ├─ Call ProductController.getAll()
    │       ├─ Query Prisma: Product.findMany()
    │       └─ Return array of products
    │   └─ Return 200 + products array
    │
    ├─ Server Component: Receives data
    │   ├─ Passes products as props to Client Component
    │   └─ Renders initial HTML with data
    │
    └─ Client Component: <ProductList products={data} />
        │
        ├─ Pass products to SWR as fallbackData
        │
        ├─ SWR Hook: useSWR('/api/proxy/products', ...)
        │   │
        │   ├─ Render with fallbackData (immediate)
        │   │
        │   └─ Background: Revalidate data
        │       ├─ HTTP GET /api/proxy/products
        │       ├─ BFF: Forward to Fastify /products
        │       ├─ SWR: Compare new data vs fallbackData
        │       └─ If changed: Update UI
        │
        └─ User sees products instantly (SSR) + updates via SWR
```

### Protected Action Flow: Create Product

```
User Action: Click "Create Product" button
    │
    ├─ Open Modal with ProductForm
    │
    ├─ Form Validation (React Hook Form + Zod)
    │
    ├─ HTTP POST /api/proxy/products
    │   ├─ Include Authorization: Bearer <token> header
    │   ├─ Include x-request-id correlation header
    │   └─ Include x-retry-count for retries
    │
    ├─ BFF Handler: /api/proxy/[...path]
    │   ├─ Receive request with Authorization header
    │   ├─ Extract token from header
    │   ├─ Validate session exists & not expired
    │   └─ Forward to backend with token intact
    │
    ├─ Fastify POST /products
    │   ├─ Hook: require-authed-hook
    │   │   ├─ Decode JWT from Authorization header
    │   │   ├─ Validate signature
    │   │   ├─ Query Session table: find by token
    │   │   ├─ Check expiry
    │   │   ├─ Load Account by accountId
    │   │   └─ Attach Account to request
    │   │
    │   ├─ Zod schema validation
    │   │   ├─ Validate name, description, price
    │   │   └─ Reject if validation fails (422)
    │   │
    │   ├─ Call ProductController.create()
    │   │   ├─ Get accountId from request.account
    │   │   ├─ Create Product in database
    │   │   └─ Return created product with id
    │   │
    │   └─ Return 201 + product
    │
    ├─ BFF Handler: Receive response
    │   ├─ Validate response structure
    │   └─ Return 201 to client
    │
    ├─ Client: Receive response
    │   ├─ Update UI (close modal)
    │   ├─ Show success toast
    │   ├─ Call SWR mutate() to refresh products list
    │   └─ Optimistic update: add product to UI immediately
    │
    └─ User sees product instantly + list updates
```

---

## Authentication & Authorization

### Token Management

**Generation:**
- User registers/logs in
- Backend creates Account and Session in database
- Backend generates JWT token with HS256 signature
- Embeds account ID in token payload
- Sets `expiresAt = now() + 24 hours`

**Storage (Dual Mode):**
1. **HttpOnly Cookie**: `sessionToken=<jwt>` (auto-sent with requests)
2. **Authorization Header**: `Authorization: Bearer <jwt>` (manual inclusion)

**Validation (Per Request):**
```
1. Fastify hook: require-authed-hook
2. Extract token from cookie OR Authorization header
3. Verify JWT signature with JWT_SECRET
4. Decode token → get accountId
5. Query Session table: find(token) where expiresAt > now()
6. Load Account by accountId
7. Attach Account to request.account
8. If any step fails → throw AuthError (401)
```

**Refresh Strategy:**

*Server-Side (Proactive):*
- Endpoint: `POST /auth/slide-session`
- Called by client before token expires (e.g., 23 hours in)
- Backend checks: `now() < expiresAt < now() + 1 hour`
- Updates: `session.expiresAt = now() + 24 hours`
- Returns new token
- Client updates storage and continues

*Client-Side (Reactive):*
- SWR interceptor catches 401 response
- Calls `/api/auth/refresh` to get new token
- Updates Zustand store
- Retries original request with new token
- If refresh fails (no valid session) → redirect to login

### Authorization Levels

```typescript
// Public routes (no auth required)
GET /products
GET /products/:id
GET /static/:id (image serving)

// Protected routes (require valid session)
POST /auth/logout
POST /auth/slide-session
GET  /account/me
PUT  /account/me
POST /products (create)
PUT  /products/:id (update own)
DELETE /products/:id (delete own)
POST /media/upload

// Authorization checks (by business logic)
PUT  /products/:id → Only owner can update (check accountId)
DELETE /products/:id → Only owner can delete (check accountId)
```

---

## Data Models & Relationships

### Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│     Account     │────────┤      Session     │
├─────────────────┤ (1:N)  ├──────────────────┤
│ id (PK)         │        │ token (PK)       │
│ email (UNIQUE)  │        │ accountId (FK)   │
│ name            │        │ expiresAt        │
│ password        │        │ createdAt        │
│ createdAt       │        └──────────────────┘
│ updatedAt       │
└────────┬────────┘
         │
         │ (1:N)
         ↓
┌─────────────────┐
│    Product      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ description     │
│ price           │
│ image           │
│ accountId (FK)  │ → Account
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

### Cascade Behavior

- When Account is deleted:
  - All Sessions are deleted (cascade)
  - All Products are deleted (cascade)

- When Session expires:
  - Token becomes invalid (checked on each request)
  - Not automatically deleted from database (lazy cleanup)

---

## API Contract Specification

### Request Format

All API requests follow this pattern:

```http
POST /api/endpoint HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer <jwt-token>
x-request-id: 550e8400-e29b-41d4-a716-446655440000

{
  "field1": "value1",
  "field2": 123
}
```

Headers:
- `Authorization`: Optional (Bearer token for protected routes)
- `x-request-id`: Optional (for request correlation/debugging)
- `Content-Type`: `application/json` (for POST/PUT requests)

### Response Format

**Success (2xx):**
```json
{
  "data": {
    "id": "product-123",
    "name": "Laptop",
    "price": 999.99
  },
  "message": "Product created successfully",
  "statusCode": 201
}
```

**Error (4xx/5xx):**
```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 422,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────┐
│    Domain (example.com)         │
└────────────────┬────────────────┘
                 │
         ┌───────┴───────┐
         ↓               ↓
    ┌────────┐      ┌────────┐
    │  CDN   │      │ Origin │
    │ (Cache)│      │(nginx) │
    └────────┘      └───┬────┘
                        │
                  ┌─────┴─────┐
                  ↓           ↓
            ┌─────────┐   ┌─────────┐
            │ Node.js │   │ Node.js │
            │Process1 │   │Process2 │
            │Port3001 │   │Port3002 │
            └────┬────┘   └────┬────┘
                 │             │
                 └──────┬──────┘
                        │
                   ┌────▼────┐
                   │ Database │
                   │ SQLite   │
                   └──────────┘
```

---

## Error Handling Strategy

### Error Classification

| Error Type | Status | Cause | User Message |
|-----------|--------|-------|--------------|
| ValidationError | 422 | Invalid input data | "Please check your form" |
| AuthError | 401 | Missing/invalid token | "Please log in again" |
| ForbiddenError | 403 | Insufficient permissions | "You don't have access" |
| NotFoundError | 404 | Resource doesn't exist | "Item not found" |
| InternalError | 500 | Server bug | "Something went wrong" |

### Error Handling in Layers

**Server**: Fast-fail validation
```typescript
// 1. Zod schema validation (422 if invalid)
// 2. Auth check (401 if missing/invalid)
// 3. Business logic checks (422 if constraint violated)
// 4. Database operation
// 5. Error handler middleware catches exceptions
```

**Client**: User-friendly error display
```typescript
try {
  await action();
} catch (error) {
  if (error.statusCode === 401) {
    redirectToLogin();
  } else if (error.statusCode === 422) {
    showFormErrors(error.details);
  } else {
    showGenericError();
  }
}
```

---

## Security Architecture

### Defense Layers

1. **Transport Layer**: HTTPS in production
2. **Application Layer**: Helmet middleware (CORS, CSP, X-Frame-Options, etc.)
3. **Authentication**: JWT with HS256 signature
4. **Authorization**: Account ID validation before operations
5. **Input Validation**: Zod schema validation on API boundaries
6. **Password Security**: bcrypt with 10 salt rounds
7. **Storage**: HttpOnly cookies (XSS protection)
8. **Secrets**: Environment variables (not hardcoded)

---

## Performance Optimization

### Frontend Optimization

- **SWR Deduplication**: Prevents duplicate requests within 2s window
- **Server Components**: Initial data from server (no loading state)
- **Code Splitting**: Next.js automatic route-based splitting
- **Lazy Loading**: Dynamic imports for heavy components
- **Caching**: SWR + browser HTTP cache

### Backend Optimization

- **Connection Pooling**: Prisma manages database connections
- **Query Optimization**: Select only needed fields
- **Indexing**: Unique constraint on email, FK on accountId
- **Async Operations**: Non-blocking I/O throughout
- **Error Fast-Fail**: Validate early to avoid expensive operations

---

## Scalability Considerations

### Horizontal Scaling Ready

- **Stateless Design**: No server-side session cache
- **Database Agnostic**: Prisma ORM allows switching databases
- **Environment Config**: All settings via environment variables

### Limitations (Current)

- SQLite not suitable for high concurrency (consider PostgreSQL in production)
- No request rate limiting implemented (should be added before production)
- No API gateway layer (could add Kong or similar for traffic management)
- File uploads stored locally (should use S3 or CDN in production)

---

## Monitoring & Debugging

### Request Tracing

All requests include:
- `x-request-id`: Unique identifier for correlation
- `x-retry-count`: Track number of retries
- Timestamps logged at each layer

### Debug Mode

Enable via environment variable:
```bash
DEBUG=* npm run dev
```

This logs:
- All API calls (URLs, status codes)
- SWR cache operations
- Auth token changes
- Error details

---

## Future Architecture Improvements

1. Add message queue (Redis/RabbitMQ) for async operations
2. Implement WebSocket for real-time features
3. Add API versioning strategy
4. Implement GraphQL layer alongside REST
5. Add comprehensive request logging & analytics
6. Implement feature flags system
7. Add automated database backup strategy
