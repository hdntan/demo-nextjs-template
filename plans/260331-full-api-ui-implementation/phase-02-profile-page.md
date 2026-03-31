---
phase: 2
title: "Profile Page (View + Edit Name)"
status: pending
effort: 1.5h
---

# Phase 02: Profile Page (View + Edit Name)

## Overview

Create a profile page at `/profile` in the main layout. Shows current account info and allows editing the display name. Follows RSC + SWR hydration pattern.

## Key Insights

- `useAccount(initialData)` returns `{ account, isLoading, error, mutate }`
- `useUpdateAccount()` returns `{ update, isLoading, error }` -- `update({ name })`
- `getMe(api)` server-side fetch for RSC hydration
- User type: `{ id, email, name }`
- Only `name` is editable (email is read-only)

## Files to Create

| File | Purpose |
|---|---|
| `client/src/app/(main)/profile/page.tsx` | RSC page -- fetches account server-side |
| `client/src/app/(main)/profile/_components/profile-view.tsx` | Client component: displays account, edit form |

## Implementation Steps

### 1. Create profile client component

**File:** `client/src/app/(main)/profile/_components/profile-view.tsx`

```
'use client'
- useAccount(initialData) for SWR hydration
- useUpdateAccount() for mutation
- Display: email (read-only), name (editable)
- Edit form inline: useForm with Zod schema { name: z.string().min(2).max(256) }
- On submit: call update({ name }), then mutate() to refresh SWR cache
- Success message: "Profile updated" (useState, auto-clear after 3s)
- Error display for API errors
- Use Card component for layout
```

UI layout:
```
Card
  CardHeader: "Profile"
  CardContent:
    <p>Email: {account.email}</p>
    <form>
      <Input label="Name" defaultValue={account.name} />
      <Button type="submit">Save</Button>
    </form>
    {success && <p className="text-green-600">Profile updated</p>}
    {error && <p className="text-red-500">{error.message}</p>}
```

### 2. Create profile RSC page

**File:** `client/src/app/(main)/profile/page.tsx`

```
// RSC pattern matching [slug]/page.tsx
import { createServerApiClient } from '@/lib/api/server'
import { getMe } from '@/lib/api/services/account.service'
import { ProfileView } from './_components/profile-view'
import { redirect } from 'next/navigation'

// Fetch account server-side, pass as initialData
// If 401, redirect to /login
```

## Todo List

- [ ] Create `profile/_components/profile-view.tsx` with view + edit form
- [ ] Create `profile/page.tsx` RSC with server-side account fetch
- [ ] Test: profile displays current name and email
- [ ] Test: name update submits and refreshes SWR
- [ ] Test: validation error for empty/short name
- [ ] Test: unauthenticated user redirects to /login

## Success Criteria

- `/profile` shows current user's email (read-only) and name (editable)
- Name edit form validates min 2 chars, submits via `useUpdateAccount()`
- SWR cache updated after successful edit (via `mutate()`)
- Success/error feedback displayed
- Unauthenticated access redirects to `/login`

## Risk Assessment

- **Risk:** Server-side fetch fails for expired token -- Mitigation: catch 401, redirect to /login
- **Risk:** SWR cache stale after update -- Mitigation: call `mutate()` with new data after successful update
