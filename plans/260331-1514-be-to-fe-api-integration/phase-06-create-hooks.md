# Phase 06 — Create SWR Hooks

**Status**: 🔴 Todo | **Priority**: Medium
**Depends on**: Phase 05 (services)

## Overview

Create SWR hooks for products and account, following the existing RSC-hydration pattern from `use-items.ts`.

## Files to Modify

### `client/src/hooks/keys.ts`
Add product and account SWR cache keys:

```ts
export const KEYS = {
  items: { list: '/items', detail: (id: string) => `/items/${id}` },
  products: {
    list: '/products',
    detail: (id: number) => `/products/${id}`,
  },
  account: {
    me: '/account/me',
  },
} as const
```

## Files to Create

### `client/src/hooks/use-products.ts`
```ts
// Read hooks (RSC hydration pattern)
export function useProducts(initialData?: Product[])
// returns: { products, isLoading, error, mutate }

export function useProduct(id: number, initialData?: Product)
// returns: { product, isLoading, error, mutate }

// Mutation hooks (client-side only, require auth)
export function useCreateProduct()
// returns: { createProduct(body), isLoading, error }
// Uses SWR mutate to revalidate products list after create

export function useUpdateProduct()
// returns: { updateProduct(id, body), isLoading, error }

export function useDeleteProduct()
// returns: { deleteProduct(id), isLoading, error }
// Optimistic update: remove from list immediately, revalidate
```

All mutation hooks use `createClientApiClient()` — proxy handles auth.

### `client/src/hooks/use-account.ts`
```ts
export function useAccount(initialData?: User)
// SWR key: KEYS.account.me
// Fetcher: getMe(createClientApiClient())
// returns: { account, isLoading, error, mutate }

export function useUpdateAccount()
// returns: { updateAccount(body: { name: string }), isLoading, error }
// On success: mutates KEYS.account.me to revalidate
```

## Notes
- Mutation hooks don't take `initialData` (write operations only)
- `useProducts` / `useProduct` follow same RSC hydration pattern as `useItems` / `useItem`
- SWR `revalidateOnFocus: false` to avoid excessive API calls

## Todo
- [ ] Update `keys.ts` with `products` and `account` keys
- [ ] Create `use-products.ts`
- [ ] Create `use-account.ts`
