---
phase: 1
title: "Register Page + Login/Register Links"
status: pending
effort: 1.5h
---

# Phase 01: Register Page + Login/Register Links

## Overview

Create a registration page at `/register` in the auth layout, mirroring the existing login page pattern. Add cross-links between login and register pages.

## Key Insights

- BFF register handler already exists at `POST /api/auth/register`
- Expects body: `{ name, email, password, confirmPassword }`
- Returns `{ user: User }` and sets session cookie (same as login)
- Backend validation: name 2-256 chars, email valid, password 6-100 chars, confirmPassword must match
- After successful register, user is auto-logged-in (cookie set by BFF)

## Files to Create

| File | Purpose |
|---|---|
| `client/src/app/(auth)/register/page.tsx` | RSC page wrapper (mirrors login/page.tsx) |
| `client/src/app/(auth)/register/_components/register-form.tsx` | Client form component |

## Files to Modify

| File | Change |
|---|---|
| `client/src/app/(auth)/login/page.tsx` | Add "Don't have an account? Register" link |

## Implementation Steps

### 1. Create register form component

**File:** `client/src/app/(auth)/register/_components/register-form.tsx`

```
'use client'
- Zod schema: name (min 2, max 256), email, password (min 6, max 100), confirmPassword
- superRefine to validate password === confirmPassword
- useForm with zodResolver
- On submit: fetch POST /api/auth/register with { name, email, password, confirmPassword }
- On success: setUser() from useAuth store, router.push('/'), router.refresh()
- Error state for API errors
- Fields: name, email, password, confirmPassword
- Submit button: "Create Account" / "Creating..."
```

Pattern: Copy `login-form.tsx` structure exactly. Add `name` and `confirmPassword` fields.

### 2. Create register page

**File:** `client/src/app/(auth)/register/page.tsx`

```tsx
// Same structure as login/page.tsx
// Title: "Create Account"
// Render <RegisterForm />
// Link at bottom: "Already have an account? Sign In" -> /login
```

### 3. Add register link to login page

**File:** `client/src/app/(auth)/login/page.tsx`

Add below `<LoginForm />`:
```tsx
<p className="text-sm text-center text-muted-foreground">
  Don't have an account?{' '}
  <Link href="/register" className="text-foreground underline">Register</Link>
</p>
```

## Todo List

- [ ] Create `register/_components/register-form.tsx` with Zod + RHF
- [ ] Create `register/page.tsx` with heading and link to login
- [ ] Add register link to `login/page.tsx`
- [ ] Test: form validation errors display
- [ ] Test: successful registration redirects to home
- [ ] Test: API error (duplicate email) shows error message

## Success Criteria

- `/register` renders a form with name, email, password, confirmPassword fields
- Client-side validation: all fields required, password match check
- Successful submit calls BFF, sets user in store, redirects to `/`
- Login page links to register, register page links to login
- Error messages display for validation and API errors

## Risk Assessment

- **Risk:** Password mismatch validation UX -- Mitigation: use Zod superRefine, show error on confirmPassword field
- **Risk:** Register endpoint returns different error shapes -- Mitigation: catch and normalize error message
