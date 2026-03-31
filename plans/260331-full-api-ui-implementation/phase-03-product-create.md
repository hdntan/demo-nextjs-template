---
phase: 3
title: "Product Create Page + Image Upload Component"
status: pending
effort: 2h
---

# Phase 03: Product Create Page + Image Upload Component

## Overview

Create a reusable image upload component and the product creation page at `/products/new` in the main layout.

## Key Insights

- `CreateProductBody`: `{ name, price, description, image }` -- image is a URL string (not File)
- `uploadMedia(file: File)` returns `{ imageUrl: string }` -- uploads file, returns URL
- Flow: user picks file -> `uploadMedia()` -> get URL -> store in form state -> submit product with URL
- `useCreateProduct()` returns `{ create, isLoading, error }`
- Product prices in VND (integer)

## Files to Create

| File | Purpose |
|---|---|
| `client/src/components/product/image-upload.tsx` | Reusable image upload component |
| `client/src/app/(main)/products/new/page.tsx` | RSC page wrapper (no server data needed) |
| `client/src/app/(main)/products/new/_components/product-create-form.tsx` | Client form component |

## Implementation Steps

### 1. Create ImageUpload component

**File:** `client/src/components/product/image-upload.tsx`

```
'use client'
Props: { value: string; onChange: (url: string) => void }
- Hidden file input, triggered by button click
- On file select: call uploadMedia(file), set uploading state
- On success: call onChange(imageUrl)
- Show preview (Next/Image) when value is set
- Show spinner during upload
- Show error if upload fails
- Accept: image/* only
- "Change image" button when image already set
```

Layout:
```
<div className="space-y-2">
  {value ? (
    <div className="relative aspect-square w-48 rounded-lg overflow-hidden bg-muted">
      <Image src={value} alt="Product" fill className="object-cover" />
    </div>
  ) : (
    <div className="aspect-square w-48 rounded-lg border-2 border-dashed flex items-center justify-center">
      {uploading ? <Spinner /> : "Click to upload"}
    </div>
  )}
  <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFile} />
  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.click()}>
    {value ? 'Change image' : 'Upload image'}
  </Button>
  {error && <p className="text-sm text-red-500">{error}</p>}
</div>
```

### 2. Create product create form

**File:** `client/src/app/(main)/products/new/_components/product-create-form.tsx`

```
'use client'
Zod schema:
  name: z.string().min(1, 'Required').max(256)
  price: z.coerce.number().int().min(0)
  description: z.string().min(1, 'Required')
  image: z.string().url('Upload an image')

- useForm with zodResolver
- useCreateProduct() for mutation
- Fields: name (Input), price (Input type="number"), description (textarea/Input), image (ImageUpload)
- ImageUpload wired via Controller or manual setValue + watch
- On submit: call create(data), router.push(`/${product.id}`)
- Back link to home
```

### 3. Create page wrapper

**File:** `client/src/app/(main)/products/new/page.tsx`

```tsx
import { ProductCreateForm } from './_components/product-create-form'

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <ProductCreateForm />
    </div>
  )
}
```

No RSC data fetch needed -- this is a pure creation form.

## Related Code Files

- `client/src/lib/api/services/media.service.ts` -- uploadMedia
- `client/src/hooks/use-products.ts` -- useCreateProduct
- `client/src/types/product.ts` -- CreateProductBody

## Todo List

- [ ] Create `components/product/image-upload.tsx`
- [ ] Create `products/new/_components/product-create-form.tsx`
- [ ] Create `products/new/page.tsx`
- [ ] Test: image upload shows preview after upload
- [ ] Test: form validation errors display for all fields
- [ ] Test: successful create redirects to product detail page
- [ ] Test: upload failure shows error, doesn't block form

## Success Criteria

- ImageUpload component: file picker, upload via `uploadMedia()`, preview, error handling
- `/products/new` renders form with name, price, description, image fields
- All fields validated client-side with Zod
- Successful submission creates product and redirects to `/{product.id}`
- ImageUpload is reusable (used again in Phase 4)

## Risk Assessment

- **Risk:** Large image upload timeout -- Mitigation: show uploading state, no form submit while uploading
- **Risk:** Image URL from backend may not match Next.js allowed domains -- Mitigation: already configured in next.config (remote patterns exist per commit da3017c)
