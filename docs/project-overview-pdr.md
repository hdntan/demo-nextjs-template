# Project Overview & PDR

## Project Overview

**Project Name**: Next.js Demo Template
**Type**: Educational Fullstack Application
**Purpose**: Learning project demonstrating modern web development with Next.js and Fastify
**Status**: Active Development
**Version**: 1.0.0

### Vision

Provide an accessible learning template for building scalable fullstack web applications using Next.js (frontend) and Fastify (backend), with emphasis on:
- Clean architecture patterns
- Type-safe development practices
- Modern authentication & security
- RESTful API design
- State management best practices

### Target Audience

- Intermediate JavaScript developers learning Next.js ecosystem
- Backend developers exploring Node.js frameworks
- Full-stack engineers studying architecture patterns

### Business Context

This is an educational project accompanying a Vietnamese Next.js course. The project intentionally keeps business logic simple (product catalog) to focus on technical patterns rather than domain complexity.

---

## Product Development Requirements (PDR)

### Functional Requirements

#### FR1: User Authentication System
- Users can register with email and password
- Users can log in with email and password
- Users can log out and clear sessions
- Sessions expire after 24 hours (sliding expiry)
- Auth state persists across page refreshes
- Password stored securely with bcrypt (salt: 10)

#### FR2: User Profile Management
- Users can view their profile (email, name)
- Users can update profile information
- Profile changes require authentication

#### FR3: Product Catalog
- Public can view all products (no login required)
- Public can view product details
- Authenticated users can create products
- Product owners can update their products
- Product owners can delete their products

#### FR4: Media Management
- Authenticated users can upload product images
- Upload size limited to 10MB
- Images served as static files
- Images persisted in local storage

#### FR5: API Gateway / BFF Pattern
- Frontend communicates via `/api/*` routes
- Server-side proxy forwards to Fastify backend
- Request correlation with `x-request-id` header
- Error handling with consistent error responses

### Non-Functional Requirements

#### NFR1: Performance
- API response time < 200ms for 95th percentile
- Initial page load < 3s (LCP)
- SWR deduplication to prevent duplicate requests
- Server-side data fetching where possible (RSC pattern)

#### NFR2: Security
- HTTPS in production
- CORS properly configured (origin whitelist)
- Helmet middleware for security headers
- HttpOnly cookies for auth tokens
- Password validation (min 8 chars recommended)
- SSRF protection in API proxy

#### NFR3: Type Safety
- 100% TypeScript coverage (strict mode)
- Zod runtime validation for API contracts
- Type-safe discriminated unions for content models
- No `any` types in codebase

#### NFR4: Code Quality
- ESLint + Prettier for linting & formatting
- Conventional commits (husky, commitlint)
- <200 line files for maintainability
- Clear separation of concerns

#### NFR5: Scalability
- Stateless API design (horizontal scaling ready)
- Database abstraction via Prisma ORM
- Service-oriented API handlers
- Token refresh strategy for auth rotation

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│          Web Browser / Client               │
│     (Next.js 16 + React 19 + SWR)           │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS
                   ↓
┌─────────────────────────────────────────────┐
│    Next.js API Routes (BFF Pattern)         │
│  /api/proxy/* → Fastify Backend             │
│  /api/auth/* → Auth handling                │
└──────────────────┬──────────────────────────┘
                   │ HTTP
                   ↓
┌─────────────────────────────────────────────┐
│     Fastify Backend (TypeScript)            │
│  - Route handlers (HTTP layer)              │
│  - Controllers (business logic)             │
│  - Middleware (auth, validation)            │
└──────────────────┬──────────────────────────┘
                   │ Prisma ORM
                   ↓
┌─────────────────────────────────────────────┐
│      SQLite Database                        │
│  - Accounts (users & passwords)             │
│  - Sessions (auth tokens)                   │
│  - Products (catalog)                       │
└─────────────────────────────────────────────┘
```

### Data Models

```prisma
model Account {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  password  String    // bcrypt hashed
  sessions  Session[]
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Session {
  token     String    @id @default(cuid())
  accountId String
  account   Account   @relation(fields: [accountId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime  @default(now())
}

model Product {
  id          String   @id @default(cuid())
  image       String?  // URL to uploaded image
  name        String
  description String?
  price       Float
  accountId   String   // product owner
  account     Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Success Metrics

### Functional Success
- All authentication flows work correctly (register → login → logout)
- CRUD operations on products function properly
- Image uploads and downloads work without errors
- API validation rejects invalid requests (422 status)

### Non-Functional Success
- Zero security vulnerabilities in dependencies
- TypeScript compilation with zero errors
- All API endpoints respond within 200ms
- SWR deduplication working (verified in network tab)

### Learning Outcomes
- Developers understand Next.js App Router
- Clear examples of RSC + Client Component patterns
- Auth implementation patterns documented
- API design principles demonstrated

---

## Constraints & Dependencies

### Technical Constraints
- Must use TypeScript (strict mode)
- Database must use Prisma ORM
- Frontend must use App Router (not Pages Router)
- Backend must be Fastify (not Express)

### External Dependencies
- Node.js 18+ required
- npm or yarn package manager
- SQLite database (file-based, no server needed)

### Known Limitations
- Single-file SQLite (not suitable for high-concurrency production)
- No database migrations in git (manual schema management)
- Auth tokens not revoked on logout (token-based only)
- No real-time features (REST only)

---

## Acceptance Criteria

The project is considered complete when:

1. **Authentication**
   - Registration and login flows fully functional
   - Session tokens work via both cookies and Authorization header
   - Token refresh prevents premature expiration

2. **Product Management**
   - Full CRUD operations for authenticated users
   - Product list loads on homepage
   - Product detail pages render correctly

3. **Frontend**
   - All pages render without errors
   - Auth state hydrates on initial load
   - No layout shift during auth initialization

4. **Backend**
   - All endpoints have Zod validation
   - Error responses use correct HTTP status codes
   - Security headers applied via Helmet

5. **Code Quality**
   - Zero TypeScript errors
   - ESLint passes without warnings
   - Conventional commits enforced
   - README and docs keep pace with changes

---

## Next Steps

1. Establish code standards and patterns (see `code-standards.md`)
2. Document system architecture in detail (see `system-architecture.md`)
3. Create deployment guidelines (see `deployment-guide.md`)
4. Build design system documentation (see `design-guidelines.md`)
