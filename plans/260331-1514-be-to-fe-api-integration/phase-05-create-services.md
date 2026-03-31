# Phase 05 — Create API Services

**Status**: 🔴 Todo | **Priority**: High
**Depends on**: Phase 01 (types)

## Overview

Create typed service functions for all backend endpoints. Each service takes an `ApiClient` and returns typed data. Services handle raw→model transformation (snake_case→camelCase if needed, response envelope unwrapping).

## Files to Create

### `client/src/lib/api/services/product.service.ts`
Replace generic `items.ts` logic with real product CRUD.

```ts
import type { ApiClient } from '@/lib/api/types'
import type { Product, CreateProductBody, UpdateProductBody } from '@/types/product'

// Raw backend shape (from ProductSchema Zod)
interface RawProduct {
  id: number; name: string; price: number; description: string;
  image: string; createdAt: string; updatedAt: string
}

// Unwraps { data: Product, message: string } envelope
export async function listProducts(api: ApiClient): Promise<Product[]>
export async function getProduct(api: ApiClient, id: number): Promise<Product>
export async function createProduct(api: ApiClient, body: CreateProductBody): Promise<Product>
export async function updateProduct(api: ApiClient, id: number, body: UpdateProductBody): Promise<Product>
export async function deleteProduct(api: ApiClient, id: number): Promise<void>
```

Endpoints: `GET/POST /products`, `GET/PUT/DELETE /products/:id`

### `client/src/lib/api/services/account.service.ts`

```ts
import type { ApiClient } from '@/lib/api/types'
import type { User } from '@/types/auth'

export async function getMe(api: ApiClient): Promise<User>
// GET /account/me → { data: { id, name, email }, message } → User

export async function updateMe(api: ApiClient, body: { name: string }): Promise<User>
// PUT /account/me → { data: { id, name, email }, message } → User
```

### `client/src/lib/api/services/auth.service.ts`
For server-side use (route handlers) that need to call backend auth directly.

```ts
import type { ApiClient } from '@/lib/api/types'
import type { User } from '@/types/auth'

export interface AuthSession { token: string; expiresAt: string; user: User }

export async function register(api: ApiClient, body: RegisterBody): Promise<AuthSession>
// POST /auth/register → unwrap data.token, data.account

export async function login(api: ApiClient, body: LoginBody): Promise<AuthSession>
// POST /auth/login → same

export async function logout(api: ApiClient): Promise<void>
// POST /auth/logout

export async function slideSession(api: ApiClient): Promise<AuthSession>
// POST /auth/slide-session → unwrap same as login
```

### `client/src/lib/api/services/media.service.ts`
Media upload needs FormData — can't use the JSON-based `ApiClient`. Upload through BFF proxy.

```ts
// Uploads a file through /api/proxy/media/upload
// Returns the image URL
export async function uploadMedia(file: File): Promise<{ imageUrl: string }>
// Uses fetch directly: POST /api/proxy/media/upload (multipart/form-data)
// Backend returns: { message: string, data: string } where data is the image URL
```

## Files to Modify

### `client/src/lib/api/services/items.ts`
Keep as-is (generic content template pattern). No changes needed — it's separate from product service.

## Todo
- [ ] Create `product.service.ts`
- [ ] Create `account.service.ts`
- [ ] Create `auth.service.ts`
- [ ] Create `media.service.ts`
