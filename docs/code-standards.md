# Code Standards & Conventions

## Overview

This document defines coding standards, conventions, and best practices for the Next.js + Fastify fullstack project. All team members must follow these guidelines to maintain code consistency and quality.

---

## TypeScript

### Strict Mode Required

All code must compile with TypeScript strict mode enabled:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### General Rules

- **No `any` types**: Use explicit types or generics instead
- **Explicit return types**: Always annotate function return types
- **Type imports**: Use `import type` for type-only imports
- **Interfaces over types**: Prefer interfaces for object shapes (better for extending)
- **Strict equality**: Use `===` and `!==`, never `==` or `!=`

### Type Examples

Good:
```typescript
function getUserProfile(id: string): Promise<User> {
  // ...
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
}

type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 422 | 500;
```

Bad:
```typescript
function getUserProfile(id: any) {
  // Missing return type
}

function getUserProfile(id: string): any {
  // Using any as return type
}
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile.tsx`, `LoginForm.tsx` |
| Hooks | camelCase, prefix `use-` | `use-auth.ts`, `use-items.ts` |
| Utilities | camelCase | `format-date.ts`, `api-client.ts` |
| Constants | UPPER_SNAKE_CASE | `API_TIMEOUT.ts`, `DEFAULT_PAGE_SIZE.ts` |
| Types/Interfaces | PascalCase | `User.ts`, `ProductSchema.ts` |
| Routes | kebab-case | `auth.route.ts`, `product.route.ts` |
| Stores | kebab-case, suffix `.store` | `auth.store.ts`, `ui.store.ts` |

### Variables & Functions

```typescript
// Constants
const API_ENDPOINT = 'http://localhost:8080';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Variables
const userName = 'John Doe';
let isLoading = false;

// Functions
function fetchUserProfile(id: string): Promise<User> {}
const calculateTotal = (items: Item[]): number => {};

// Private methods
class UserService {
  private validateEmail(email: string): boolean {}
}

// Boolean functions
const isValidEmail = (email: string): boolean => {};
const hasPermission = (user: User, action: string): boolean => {};
```

### React Components

```typescript
// Component names are PascalCase
export function UserProfile({ userId }: Props) {}
export const LoginForm: React.FC<LoginFormProps> = (props) => {};

// Props type naming
interface UserProfileProps {
  userId: string;
  onSuccess?: () => void;
}

// Event handlers
const handleSubmit = (e: React.FormEvent) => {};
const handleClick = () => {};
const onUserDelete = (userId: string) => {};
```

---

## File Organization

### Server (Fastify)

```
server/src/
├── controllers/
│   └── {domain}.controller.ts    // Business logic
├── routes/
│   └── {domain}.route.ts         // HTTP routing
├── schemaValidations/
│   └── {domain}.schema.ts        // Zod schemas
├── plugins/
│   └── {feature}.plugin.ts       // Middleware
├── hooks/
│   └── require-authed.hook.ts    // Pre-handlers
├── utils/
│   └── {utility}.ts              // Helper functions
├── types/
│   └── {type}.ts                 // Type definitions
├── constants/
│   └── {feature}.constant.ts     // Constants
├── database/
│   └── db.ts                     // Prisma client
├── index.ts                      // Entry point
├── config.ts                     // Environment config
└── type.d.ts                     // Global declarations
```

### Client (Next.js)

```
client/src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...path]/route.ts
│   │   └── proxy/
│   │       └── [...path]/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   └── {component}.tsx
│   ├── layout/
│   │   └── {layout}.tsx
│   ├── item/
│   │   └── {item-card}.tsx
│   ├── providers/
│   │   └── {provider}.tsx
│   └── shelf/
│       └── {shelf}.tsx
├── hooks/
│   └── use-{hook}.ts
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── services.ts
│   ├── auth/
│   │   └── {auth-util}.ts
│   └── net/
│       └── fetch.ts
├── store/
│   └── {store}.store.ts
├── types/
│   └── {type}.ts
└── config/
    └── {config}.ts
```

---

## Function & Component Size

### File Length Limits

- **Controllers/Handlers**: Max 200 lines
- **Components**: Max 200 lines
- **Utilities**: Max 150 lines
- **Hooks**: Max 100 lines
- **Schemas/Types**: No strict limit (declarations only)

### Breaking Points

When a file exceeds its limit:
1. Extract reusable logic to separate utilities
2. Split large components into smaller sub-components
3. Create domain-specific service classes

Example:
```typescript
// ❌ Don't do this - 300 line component
export function ProductForm({ ...props }) {
  // 300 lines of validation, API calls, rendering...
}

// ✅ Do this instead - Break into pieces
export function ProductForm({ ...props }) {
  return (
    <form onSubmit={handleSubmit}>
      <ProductBasicInfo {...props} />
      <ProductPricingSection {...props} />
      <ProductImagesSection {...props} />
    </form>
  );
}
```

---

## Imports & Exports

### Organization

```typescript
// 1. External packages
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// 2. Internal absolute imports (using @/)
import { useAuth } from '@/hooks/use-auth';
import { UserService } from '@/lib/api/services';
import type { User } from '@/types/user';

// 3. Blank line
// 4. Relative imports (if needed)
import { Button } from './button';

// Blank line
// 5. Type imports grouped
import type { ComponentProps } from './types';
```

### Default vs Named Exports

- **Use default exports** for: React components, page files
- **Use named exports** for: Utilities, hooks, services, types

```typescript
// components/UserProfile.tsx
export default function UserProfile() {}

// hooks/use-auth.ts
export function useAuth() {}
export function useLogin() {}

// lib/api/services.ts
export class UserService {}
export class ProductService {}
```

---

## Error Handling

### Server (Fastify)

```typescript
// Custom error classes
class EntityError extends Error {
  constructor(message: string, details?: unknown) {
    super(message);
    this.name = 'EntityError';
    this.details = details;
    this.statusCode = 422;
  }
}

class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}

// Usage in controllers
export const loginController = async (req: FastifyRequest, res: FastifyReply) => {
  if (!validCredentials) {
    throw new AuthError('Invalid email or password');
  }

  const errors = validateInput(data);
  if (errors.length > 0) {
    throw new EntityError('Validation failed', errors);
  }
};
```

### Client (React)

```typescript
// Try-catch for API calls
try {
  const user = await UserService.login(email, password);
  setUser(user);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      // Handle auth error
      showToast('Invalid credentials');
    } else if (error.statusCode === 422) {
      // Handle validation error
      showFormErrors(error.details);
    }
  } else {
    showToast('An unexpected error occurred');
  }
}

// SWR error handling
const { data, error } = useSWR('/api/user', fetcher);

if (error) {
  return <div>Failed to load: {error.message}</div>;
}
```

---

## Validation

### Zod Schemas

All API inputs/outputs must have Zod schemas:

```typescript
// server/src/schemaValidations/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  name: z.string().optional(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// server/src/routes/auth.route.ts
fastify.post('/auth/register', {
  schema: {
    body: registerSchema,
  },
  async handler(request, reply) {
    const data = request.body; // Already validated & typed
  }
});
```

### React Form Validation

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

## Code Style

### Formatting

- **Indentation**: 2 spaces (Prettier default)
- **Line length**: Max 100 characters (soft limit)
- **Trailing commas**: Multi-line objects/arrays
- **Quotes**: Single quotes for strings, double for JSX attributes

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### ESLint Configuration

Enforce:
- No unused variables
- No console logs in production code
- No commented-out code
- TypeScript strict rules
- React best practices (hooks, fragments, etc.)

---

## Comments & Documentation

### When to Comment

Write comments for **why**, not **what** the code does:

Good:
```typescript
// Sliding expiry: refresh token timestamp to extend session
session.expiresAt = addHours(new Date(), 24);

// Use bcrypt's default cost factor (10) for production
const hashed = await bcrypt.hash(password, 10);
```

Bad:
```typescript
// Set expiration to 24 hours
session.expiresAt = addHours(new Date(), 24);

// Hash the password with bcrypt
const hashed = await bcrypt.hash(password, 10);
```

### JSDoc for Public APIs

```typescript
/**
 * Fetches user profile by ID.
 *
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to user profile or null if not found
 * @throws ApiError if request fails
 *
 * @example
 * const user = await getUserProfile('user-123');
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  // ...
}
```

---

## Testing

### Unit Tests

```typescript
// ✅ Good - Clear test names
describe('calculateTotal', () => {
  it('should return sum of all item prices', () => {
    const items = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(30);
  });

  it('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

### Integration Tests

```typescript
describe('POST /auth/login', () => {
  it('should return token on valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

---

## Git Commits

Follow **Conventional Commits** format:

```
type(scope): description

[optional body]
[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without behavior change
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build, dependency, or tooling changes

### Examples

```
feat(auth): implement JWT token refresh mechanism

When users' sessions approach expiry, tokens are automatically
refreshed server-side to maintain uninterrupted access.

Resolves #123
```

```
fix(products): prevent null reference in price calculation

Guard clause added to handle undefined product prices.
```

```
docs(readme): add quick start section
```

---

## Performance Guidelines

### Client (React/Next.js)

- Use `React.memo()` for expensive components
- Lazy load routes with `next/dynamic`
- Use SWR for data fetching (automatic deduplication)
- Minimize re-renders with proper key props in lists
- Extract large computations to `useMemo()`

### Server (Fastify)

- Use connection pooling for database
- Cache frequently accessed data
- Validate input early to fail fast
- Use async/await, avoid callback pyramids
- Monitor query performance with Prisma Studio

---

## Security Best Practices

### Server
- Validate all inputs with Zod schemas
- Hash passwords with bcrypt (min 10 rounds)
- Use HTTPS in production
- Apply security headers (Helmet middleware)
- Implement rate limiting
- Sanitize error messages (don't leak stack traces)

### Client
- Never store sensitive data in localStorage
- Use HttpOnly cookies for auth tokens
- Validate tokens before API calls
- Implement CSRF protection for state-changing operations
- Escape user input in templates

### General
- Keep dependencies up to date
- Run `npm audit` regularly
- Review third-party package licenses
- Don't commit `.env` files or secrets
- Use environment variables for configuration

---

## Pre-commit Checklist

Before submitting a pull request:

- [ ] Code compiles without errors (`npm run build`)
- [ ] TypeScript strict mode passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier formatting applied (`npm run format`)
- [ ] No console logs left in code
- [ ] All functions have return types
- [ ] No `any` types used
- [ ] Tests pass (`npm test`)
- [ ] Commit messages follow conventional format
- [ ] No secrets committed

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Zod Validation](https://zod.dev)
- [Conventional Commits](https://www.conventionalcommits.org/)
