---
phase: 5
title: "Header Nav Polish"
status: pending
effort: 1h
---

# Phase 05: Header Nav Polish

## Overview

Update Header and UserBadge to show authenticated navigation links: "Add Product" in nav, profile link and logout in UserBadge, register link for guests.

## Key Insights

- Header is a server component currently, but nav links need auth state
- UserBadge is already a client component with `useAuth()`
- Solution: move auth-dependent nav into UserBadge (already client), keep Header as server component
- Current UserBadge just shows `user.name ?? user.email` or "Guest"

## Files to Modify

| File | Change |
|---|---|
| `client/src/components/layout/header.tsx` | Remove TODO comment, keep structure clean |
| `client/src/components/layout/user-badge.tsx` | Add auth-aware links: profile, logout, add product, login/register for guests |

## Implementation Steps

### 1. Update UserBadge

**File:** `client/src/components/layout/user-badge.tsx`

Transform from simple text span into auth-aware nav cluster:

```
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

- If !isHydrated: return null (skeleton avoidance)
- If authenticated:
    <div className="flex items-center gap-4">
      <Link href="/products/new" className="text-sm hover:text-foreground text-muted-foreground">
        Add Product
      </Link>
      <Link href="/profile" className="text-sm hover:text-foreground text-muted-foreground">
        {user.name ?? user.email}
      </Link>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
- If guest:
    <div className="flex items-center gap-2">
      <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
        Sign In
      </Link>
      <Link href="/register">
        <Button size="sm">Register</Button>
      </Link>
    </div>
- handleLogout: logout(), router.push('/login'), router.refresh()
```

### 2. Clean up Header

**File:** `client/src/components/layout/header.tsx`

- Remove the TODO comment on line 16
- No structural changes needed -- UserBadge handles auth-aware rendering

## Todo List

- [ ] Update `user-badge.tsx` with auth-aware links and logout
- [ ] Remove TODO comment from `header.tsx`
- [ ] Test: authenticated user sees "Add Product", profile name, Logout button
- [ ] Test: guest sees "Sign In" and "Register" links
- [ ] Test: logout clears session and redirects to /login
- [ ] Test: profile link navigates to /profile

## Success Criteria

- Authenticated users see: "Add Product" link, profile name link (to /profile), Logout button
- Guest users see: "Sign In" link (to /login), "Register" button (to /register)
- Logout clears auth state and redirects to /login
- Header stays clean as server component, auth logic in client UserBadge
- No hydration mismatch (UserBadge returns null until hydrated)

## Risk Assessment

- **Risk:** Hydration flash -- Mitigation: already handled by `!isHydrated` check returning null
- **Risk:** UserBadge grows too large -- Mitigation: at ~40 lines total, well under 200-line limit
