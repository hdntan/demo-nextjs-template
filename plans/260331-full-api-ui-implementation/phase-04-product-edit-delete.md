---
phase: 4
title: "Product Edit Page + Delete Button"
status: pending
effort: 2h
---

# Phase 04: Product Edit Page + Delete Button on Detail

## Overview

Create product edit page at `/[slug]/edit` and add a delete button to the existing product detail page. Both require authentication.

## Key Insights

- `useUpdateProduct()` returns `{ update(id, body), isLoading, error }`
- `useDeleteProduct()` returns `{ remove(id), isLoading, error }`
- `UpdateProductBody` = `CreateProductBody` (same shape: name, price, description, image)
- Edit form is nearly identical to create form but pre-populated
- Detail page already fetches product by ID via RSC

## Files to Create

| File | Purpose |
|---|---|
| `client/src/app/(main)/[slug]/edit/page.tsx` | RSC page -- fetches product for pre-population |
| `client/src/app/(main)/[slug]/edit/_components/product-edit-form.tsx` | Client form, pre-filled with product data |

## Files to Modify

| File | Change |
|---|---|
| `client/src/app/(main)/[slug]/_components/product-detail.tsx` | Add Edit link + Delete button (auth-only) |

## Implementation Steps

### 1. Create product edit form

**File:** `client/src/app/(main)/[slug]/edit/_components/product-edit-form.tsx`

```
'use client'
Props: { initialData: Product }
- Same Zod schema as create form (name, price, description, image)
- useForm with defaultValues from initialData
- useUpdateProduct() for mutation
- ImageUpload component with value={watch('image')}
- On submit: update(initialData.id, data), router.push(`/${initialData.id}`)
- Back link: "Cancel" -> `/${initialData.id}`
```

Nearly identical to `product-create-form.tsx`. Key differences:
- `defaultValues` from `initialData`
- Calls `update(id, body)` instead of `create(body)`
- Title: "Edit Product"

### 2. Create edit page RSC

**File:** `client/src/app/(main)/[slug]/edit/page.tsx`

```
// Same pattern as [slug]/page.tsx
- Parse slug as integer ID
- createServerApiClient() -> getProduct(api, id)
- 404 if NaN or not found
- Render <ProductEditForm initialData={product} />
```

### 3. Add Edit + Delete to product detail

**File:** `client/src/app/(main)/[slug]/_components/product-detail.tsx`

Add below the product info section:
```
- Import useAuth, useDeleteProduct, useRouter, Link
- Show Edit/Delete buttons only when user is authenticated
- Edit: <Link href={`/${product.id}/edit`}>Edit</Link> styled as Button variant="outline"
- Delete: <Button variant="destructive" onClick={handleDelete}>Delete</Button>
- handleDelete: confirm dialog, then remove(product.id), router.push('/')
- Show loading state on delete button while deleting
```

Add to imports and component body. Keep file under 200 lines -- the additions are ~25 lines.

## Related Code Files

- `client/src/components/product/image-upload.tsx` (from Phase 3)
- `client/src/hooks/use-products.ts` -- useUpdateProduct, useDeleteProduct
- `client/src/hooks/use-auth.ts` -- useAuth (for auth-gating buttons)

## Todo List

- [ ] Create `[slug]/edit/_components/product-edit-form.tsx`
- [ ] Create `[slug]/edit/page.tsx` RSC
- [ ] Add Edit link + Delete button to `product-detail.tsx`
- [ ] Test: edit form pre-populated with current product data
- [ ] Test: successful edit updates product and redirects
- [ ] Test: delete shows confirm, deletes, redirects to home
- [ ] Test: edit/delete buttons hidden for unauthenticated users

## Success Criteria

- `/[id]/edit` shows form pre-filled with product data
- Update submits correctly and redirects to detail page
- Delete button on detail page shows confirm(), removes product, redirects to `/`
- Edit/Delete buttons only visible to authenticated users
- ImageUpload reused from Phase 3

## Risk Assessment

- **Risk:** User edits product they don't own -- Mitigation: backend enforces ownership; UI shows generic error
- **Risk:** Delete without confirm -- Mitigation: use `window.confirm()` before API call
