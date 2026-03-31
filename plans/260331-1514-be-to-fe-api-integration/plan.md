# BE→FE API Integration Plan

**Status**: ✅ Complete
**Date**: 2026-03-31
**Goal**: Wire the Fastify backend to the Next.js frontend — fix all mismatches, create typed services and SWR hooks for all endpoints.

## Critical Mismatches Found

| Issue | Backend | Frontend (broken) |
|-------|---------|-------------------|
| Auth response | `{ data: { token, account } }` | expects `{ accessToken, refreshToken, user }` |
| Token strategy | Single sliding session token | access + refresh pair (broken) |
| User id type | `id: number` | `id: string` |
| Refresh endpoint | `POST /auth/slide-session` | `/auth/refresh` (doesn't exist) |
| Get account | `GET /account/me` | BFF calls `/auth/me` (doesn't exist) |
| Product list | `GET /products` | service calls `/items` (wrong) |
| Public proxy | Products GET is public | proxy requires auth token |
| Binary upload | multipart/form-data | proxy breaks binary with `.text()` |

## Phases

| # | Phase | Status | Priority |
|---|-------|--------|----------|
| 1 | [Fix core types](./phase-01-fix-types.md) | ✅ Done | High |
| 2 | [Fix BFF auth routes](./phase-02-fix-bff-auth.md) | ✅ Done | High |
| 3 | [Fix server & net clients](./phase-03-fix-server-net-clients.md) | ✅ Done | High |
| 4 | [Fix proxy route](./phase-04-fix-proxy.md) | ✅ Done | Medium |
| 5 | [Create API services](./phase-05-create-services.md) | ✅ Done | High |
| 6 | [Create SWR hooks](./phase-06-create-hooks.md) | ✅ Done | Medium |

## Key Dependencies

```
Phase 1 (types) → Phase 2 (BFF) → Phase 3 (clients)
Phase 1 (types) → Phase 5 (services) → Phase 6 (hooks)
Phase 4 (proxy) runs independently
```
