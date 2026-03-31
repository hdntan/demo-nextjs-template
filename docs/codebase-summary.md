# Codebase Summary

Generated: 2026-03-31

## Overview

The codebase is organized as a fullstack monorepo with clear separation between frontend (Next.js) and backend (Fastify). Both layers use TypeScript and follow similar architectural patterns for maintainability and type safety.

**Total Size**: ~3,150 lines of TypeScript code
- **Server**: ~1,119 lines
- **Client**: ~2,024 lines
- **Shared Types**: Minimal (mostly defined per layer)

---

## Server Architecture (Fastify Backend)

### Directory Structure

```
server/src/
├── controllers/          (4 files, 178 LOC) - Business logic handlers
├── routes/              (6 files, 478 LOC) - HTTP endpoint definitions
├── schemaValidations/   (4 files, 116 LOC) - Zod validation schemas
├── plugins/             (3 files, 139 LOC) - Fastify middleware & plugins
├── hooks/               (1 file, 22 LOC)  - Pre-validation auth hook
├── utils/               (4 files, 89 LOC)  - Helper functions
├── constants/           (2 files, 5 LOC)   - Enums & error codes
├── types/               (1 file)            - JWT type definitions
├── database/            (1 file, 9 LOC)    - Prisma client
├── index.ts             (75 LOC)            - Server entry point
├── config.ts            (49 LOC)            - Environment validation
└── type.d.ts            (19 LOC)            - TypeScript declarations
```

### Key Components

**controllers/**
- `accountController.ts` - User profile operations (get, update)
- `authController.ts` - Authentication handlers (register, login, logout, refresh)
- `productController.ts` - Product CRUD operations
- `mediaController.ts` - Image upload & retrieval

**routes/**
- `auth.route.ts` - POST /auth/register, login, logout, slide-session
- `account.route.ts` - GET/PUT /account/me
- `product.route.ts` - GET/POST/PUT/DELETE /products
- `media.route.ts` - POST /media/upload, GET /static/:id
- `test.route.ts` - Health check endpoint

**schemaValidations/**
- `auth.schema.ts` - Register/login request validation
- `account.schema.ts` - Profile update validation
- `product.schema.ts` - Product CRUD validation
- `common.schema.ts` - Shared patterns (pagination, errors)

**plugins/**
- `auth-plugin.ts` - JWT decode & validation
- `helmet-plugin.ts` - Security headers (CORS, CSP)
- `multipart-plugin.ts` - File upload handling (10MB limit)

**hooks/**
- `require-authed-hook.ts` - Pre-route auth check, attaches Account to request

### Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| fastify | 4.26.0 | HTTP framework |
| prisma | 5.10.2 | ORM |
| zod | 4.3.6 | Runtime validation |
| fastify-type-provider-zod | Latest | Zod integration for fastify |
| @fastify/helmet | Latest | Security headers |
| @fastify/multipart | Latest | File upload |
| @fastify/cookie | Latest | Cookie handling |
| fast-jwt | Latest | JWT signing/verification |
| bcrypt | Latest | Password hashing |
| typescript | 5.3.3 | Language |

### API Contract

**Base URL**: `http://localhost:8080`

**Authentication**:
- Bearer token in `Authorization: Bearer <token>` header
- OR `sessionToken` cookie

**Response Format**:
```json
{
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}
```

**Error Format**:
```json
{
  "error": {
    "message": "...",
    "statusCode": 422,
    "details": [...] // Zod validation errors
  }
}
```

---

## Client Architecture (Next.js Frontend)

### Directory Structure

```
client/src/
├── app/                 (800+ LOC)  - App Router pages & layouts
│   ├── (auth)/         - Login & register pages with layout
│   ├── (main)/         - Public & protected pages (home, detail, create, edit, profile)
│   └── api/            - BFF route handlers (auth, proxy)
├── components/          (784 LOC)   - React components
│   ├── ui/             - Base UI primitives (button, modal, etc.)
│   ├── item/           - Polymorphic content cards (5 variants)
│   ├── shelf/          - Layout containers (grid, scroll)
│   ├── layout/         - Header, footer, navigation
│   └── providers/      - Context providers
├── hooks/               (86 LOC)    - Custom React hooks
├── lib/                 (394 LOC)   - Utilities
│   ├── api/            - API client & services
│   ├── auth/           - JWT utilities
│   └── net/            - Low-level fetch
├── store/               (48 LOC)    - Zustand state
├── types/               (44 LOC)    - TypeScript interfaces
└── config/              (29 LOC)    - Environment & constants
```

### Key Components

**app/**
- `(auth)/login/page.tsx` - Login form with React Hook Form
- `(auth)/register/page.tsx` - User registration form (POST /auth/register)
- `(main)/page.tsx` - Product listing with SWR data fetching
- `(main)/[slug]/page.tsx` - Product detail page with edit button (authenticated users)
- `(main)/[slug]/edit/page.tsx` - Edit product form (PUT/DELETE /products/:id)
- `(main)/products/new/page.tsx` - Create product form with image upload (POST /products, POST /media/upload)
- `(main)/profile/page.tsx` - User profile management (GET/PUT /account/me)
- `api/proxy/[...path]/route.ts` - Backend proxy (SSRF-safe)
- `api/auth/*` - Auth endpoint handlers (login, logout, refresh)

**components/ui/**
- Button, Modal, Input, Card, Badge, Icon components
- ImageUpload component with file validation & preview
- 9 reusable primitives with TailwindCSS styling

**components/item/**
- `CourseCard.tsx`, `ArticleCard.tsx`, `EventCard.tsx`, `ItemCard.tsx`
- Polymorphic pattern using discriminated unions
- Responsive grid layout

**lib/api/**
- `client.ts` - BFF client for API calls
- `server.ts` - Direct backend calls (for RSC)
- `services.ts` - High-level API services
- Error handling & request/response transformation

**hooks/**
- `useAuth()` - Access auth state from Zustand
- `useItems()` - Fetch & cache items with SWR
- `useSWRWithAuth()` - SWR wrapper with token refresh

**store/**
- `auth.store.ts` - Login state, user profile, token
- `ui.store.ts` - Modal visibility, loading states

### Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.2.1 | React framework with App Router |
| react | 19.2.4 | UI library |
| react-hook-form | 7.72.0 | Form state management |
| zod | 4.3.6 | Form validation |
| zustand | 5.0.12 | Global state management |
| swr | 2.4.1 | Data fetching & caching |
| tailwindcss | 4 | Utility-first CSS |
| shadcn/ui | 4.1.1 | Component library |
| lucide-react | Latest | Icon library |
| typescript | 5 | Language |

### Routing

| Route | Type | Purpose |
|-------|------|---------|
| / | Public | Product listing (home) |
| /login | Public | Login form |
| /register | Public | User registration form |
| /[slug] | Public | Product detail page |
| /[slug]/edit | Protected | Edit product form |
| /products/new | Protected | Create product form |
| /profile | Protected | View & edit account name |
| /api/auth/login | Private | BFF auth endpoint |
| /api/auth/logout | Private | BFF logout endpoint |
| /api/auth/me | Private | BFF user profile |
| /api/auth/refresh | Private | BFF token refresh |
| /api/proxy/[...path] | Private | Generic backend proxy |

### Data Fetching Pattern

```
1. Server Component (RSC) fetches from backend via api/server.ts
2. Returns data as props to Client Component
3. Client Component passes data to SWR as fallbackData
4. SWR revalidates in background, updates UI if needed
```

This pattern provides:
- SEO-friendly (server fetches for SSR)
- Fast initial paint (data from server)
- Automatic updates (SWR revalidation)
- Type-safe props

---

## Shared Patterns

### Authentication Flow

```
1. User submits credentials at /login
2. BFF (/api/auth/login) validates & calls backend
3. Backend returns token in cookie
4. BFF sets HttpOnly cookie
5. AuthInitializer component reads token & hydrates Zustand
6. Protected routes check auth state
7. Requests include token via Authorization header or cookie
```

### Error Handling

**Server**: Custom error classes
- `EntityError` (422) - Validation or business logic
- `AuthError` (401) - Missing/invalid credentials
- `ForbiddenError` (403) - Insufficient permissions

**Client**: Interceptors in `lib/net/fetch.ts`
- 401 → Trigger token refresh → Retry request
- 4xx → Show toast error
- 5xx → Show generic error message

### Type Safety

**Discriminated Union Pattern** (Content Items):
```typescript
type ContentModel =
  | { type: 'course'; courseId: string; ... }
  | { type: 'article'; articleId: string; ... }
  | { type: 'event'; eventId: string; ... }
  | { type: 'item'; itemId: string; ... }
```

Enables:
- Compile-time type checking
- Runtime type narrowing
- Exhaustiveness checking in switch statements

---

## Database Schema

### Models

**Account**
- `id` (string, primary key)
- `email` (string, unique)
- `name` (string, optional)
- `password` (string, bcrypt hashed)
- `createdAt`, `updatedAt`

**Session**
- `token` (string, primary key)
- `accountId` (foreign key)
- `expiresAt` (datetime)
- `createdAt`

**Product**
- `id` (string, primary key)
- `name` (string)
- `description` (string, optional)
- `price` (float)
- `image` (string, URL, optional)
- `accountId` (foreign key, product owner)
- `createdAt`, `updatedAt`

### Relationships
- Account → Sessions (1:N, cascade delete)
- Account → Products (1:N, cascade delete)

---

## Configuration & Environment

### Server (`server/.env`)
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=8080
ALLOWED_ORIGIN=http://localhost:3000
```

### Client (`client/.env.local`)
```
NEXT_PUBLIC_API_ENDPOINT=http://localhost:8080
```

---

## Development Tools & Quality

### Linting & Formatting
- ESLint 9 (TypeScript rules)
- Prettier 3.8.1 (code formatting)
- Husky 9.1.7 (git hooks)
- Commitlint (conventional commits)

### Build & Runtime
- TypeScript strict mode
- tsc-alias for path resolution (`@/*`)
- Nodemon for auto-reload in development

### Security
- Helmet for HTTP security headers
- bcrypt for password hashing (10 rounds)
- JWT with HS256 signature
- CORS origin whitelist
- HttpOnly cookies (XSS protection)

---

## Key Design Decisions

1. **BFF Pattern**: Frontend proxies through `/api/*` routes for SSRF protection and centralized error handling
2. **Dual Auth Modes**: Support both cookies and Authorization header for flexibility
3. **Token Refresh**: Server-side proactive refresh (pre-expiry check) + client-side reactive (401 intercept)
4. **RSC + SWR**: Combine server-side rendering with client-side hydration for optimal performance
5. **Zod Validation**: Runtime type checking on API boundaries (client input + server output)
6. **Request Correlation**: `x-request-id` header on all requests for debugging

---

## Performance Considerations

- SWR deduplication prevents duplicate requests within 2s window
- Server components fetch data (no flash of loading state)
- Image URLs served via CDN/static handler
- Token refresh cached at SWR level
- Lazy loading routes with Next.js code splitting

---

## Testing Strategy

Not yet implemented. Recommended approach:
- **Unit Tests**: Controller logic, utility functions
- **Integration Tests**: API endpoints with real database
- **E2E Tests**: Login flow, CRUD operations, error scenarios
- **Type Tests**: Zod schema validation

---

## Future Improvements

1. Add comprehensive test suite
2. Implement real-time features (WebSocket)
3. Add database migrations & seeding
4. Implement request rate limiting
5. Add analytics & monitoring
6. Expand content model types
7. Add pagination to product listing
