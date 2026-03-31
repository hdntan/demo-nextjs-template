# Next.js Demo Template - Fullstack E-Commerce

A modern fullstack learning project demonstrating Next.js 16 + Fastify 4 with TypeScript. This is an educational template for a Vietnamese Next.js course, featuring a simple product catalog with authentication and CRUD operations.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Development

```bash
# Terminal 1: Start the Fastify backend (port 8080)
cd server
npm run dev

# Terminal 2: Start the Next.js frontend (port 3000)
cd client
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build & Deploy

```bash
# Build server
cd server
npm run build

# Build client
cd client
npm run build

# Start production server
npm start
```

## Project Structure

```
demo-nextjs-template/
├── server/               # Fastify backend
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── plugins/      # Middleware & plugins
│   │   ├── schemaValidations/ # Zod schemas
│   │   └── index.ts      # Server entry point
│   └── prisma/
│       └── schema.prisma # Database models
├── client/               # Next.js frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & API clients
│   │   ├── hooks/        # Custom hooks
│   │   └── store/        # Zustand state
│   └── public/           # Static assets
├── docs/                 # Documentation
└── *.md                  # Course lesson files
```

## Tech Stack

**Backend:**
- Fastify 4.26.0 (Node.js HTTP framework)
- Prisma 5.10.2 (ORM)
- SQLite (database)
- JWT authentication (HS256)
- Zod (schema validation)

**Frontend:**
- Next.js 16.2.1 (App Router)
- React 19
- TailwindCSS 4
- Zustand (state management)
- SWR (data fetching)
- React Hook Form

## Key Features

- **Authentication**: JWT-based sessions with HttpOnly cookies
- **Authorization**: Middleware-protected routes
- **File Uploads**: Image upload with Fastify multipart
- **API Design**: RESTful endpoints with Zod validation
- **State Management**: Zustand for auth & UI state, SWR for server state
- **Type Safety**: Full TypeScript coverage
- **Security**: Helmet middleware, password hashing, CORS

## Core API Endpoints

### Authentication
- `POST /auth/register` - Register new account
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - Logout (protected)
- `POST /auth/slide-session` - Refresh session expiry

### Account
- `GET /account/me` - Get current user profile (protected)
- `PUT /account/me` - Update user profile (protected)

### Products
- `GET /products` - List all products
- `GET /products/:id` - Get product details
- `POST /products` - Create product (protected)
- `PUT /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)

### Media
- `POST /media/upload` - Upload image (protected, 10MB max)
- `GET /static/:id` - Serve uploaded images

## Development

- See `docs/code-standards.md` for coding conventions
- See `docs/system-architecture.md` for architecture details
- See `docs/deployment-guide.md` for deployment instructions
- See `docs/design-guidelines.md` for UI/UX patterns

## Learning Resources

This project includes course lesson files (numbered *.md files) covering:
- Next.js fundamentals
- App Router concepts
- Server vs Client components
- Authentication patterns
- Rendering strategies

## License

Educational project for learning purposes.
