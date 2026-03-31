---
title: "Full API UI Implementation"
description: "Add missing UI pages: register, profile, product CRUD, image upload, nav polish"
status: completed
priority: P1
effort: 8h
branch: main
tags: [ui, nextjs, crud, auth]
created: 2026-03-31
---

# Full API UI Implementation

All backend APIs and frontend hooks/services exist. This plan adds the missing UI pages and forms.

## Architecture Pattern

- RSC page.tsx fetches data server-side, passes to `_components/` client components
- Client components use SWR hooks with `fallbackData` for hydration
- Forms: React Hook Form + Zod validation + shadcn/ui primitives
- Auth pages in `(auth)/`, protected pages in `(main)/`

## Phases

| # | Phase | Files | Effort | Status |
|---|-------|-------|--------|--------|
| 1 | [Register page + login/register links](./phase-01-register-page.md) | 3 create, 1 modify | 1.5h | ✅ Done |
| 2 | [Profile page (view + edit name)](./phase-02-profile-page.md) | 3 create | 1.5h | ✅ Done |
| 3 | [Product create + image upload](./phase-03-product-create.md) | 4 create | 2h | ✅ Done |
| 4 | [Product edit + delete on detail](./phase-04-product-edit-delete.md) | 3 create, 1 modify | 2h | ✅ Done |
| 5 | [Header nav polish](./phase-05-header-nav-polish.md) | 2 modify | 1h | ✅ Done |

## Dependencies

- Phase 3 creates `ImageUpload` component reused by Phase 4
- Phase 5 depends on Phase 1 (register link) and Phase 2 (profile link)
- Phases 1 and 2 are independent and can be parallelized

## Key Hooks/Services (already implemented)

| Hook/Service | Location |
|---|---|
| `useAuth()` login/logout | `hooks/use-auth.ts` |
| `useAccount()` / `useUpdateAccount()` | `hooks/use-account.ts` |
| `useCreateProduct()` / `useUpdateProduct()` / `useDeleteProduct()` | `hooks/use-products.ts` |
| `uploadMedia(file)` | `lib/api/services/media.service.ts` |
| BFF register POST | `app/api/auth/[action]/route.ts` |
