# Test Infrastructure Setup Plan

**Date:** 2026-03-31
**Status:** Not Started
**Priority:** Critical

---

## Overview

The Next.js client project requires a complete test infrastructure setup. Currently, there is zero test coverage with no test runner configured. This plan outlines the setup required to enable comprehensive automated testing.

---

## Current State

### What's Missing
- [ ] Test runner (Jest or Vitest)
- [ ] Testing libraries (@testing-library/react, etc.)
- [ ] Test configuration files
- [ ] Test utilities and helpers
- [ ] Package.json test scripts
- [ ] Test file structure
- [ ] CI/CD test integration
- [ ] Coverage reporting tools

### Existing Foundation
- TypeScript configured (good for type-safe tests)
- ESLint configured (can integrate with testing rules)
- Prettier configured (code consistency)
- Husky configured (can add pre-commit test hooks)

---

## Recommended Test Stack

### Test Framework: Jest
**Rationale:**
- Industry standard for React/Next.js projects
- Excellent TypeScript support
- Comprehensive mocking capabilities
- Great snapshot testing
- Built-in coverage reporting
- Large ecosystem and community support

**Alternative:** Vitest (faster, but Jest is more stable for Next.js)

### Component Testing: React Testing Library
**Rationale:**
- Best practices for React component testing
- Tests user behavior, not implementation
- Great accessibility testing
- Commonly used with Jest
- Excellent documentation

### HTTP Mocking: Mock Service Worker (MSW) or Jest Mocks
**Rationale:**
- MSW for integration tests (intercepts fetch/axios)
- Jest mocks for unit tests
- Realistic API simulation

### Additional Tools
- `jest-environment-jsdom` - Browser environment for component tests
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation

---

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jest-environment-jsdom
npm install --save-dev msw # Mock Service Worker (optional)
```

### Step 2: Create Jest Configuration
**File:** `jest.config.ts`
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/**/*.stories.tsx',
  ],
  coverageThresholds: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
```

### Step 3: Create Jest Setup File
**File:** `jest.setup.ts`
```typescript
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
      isLocaleDomain: false,
      isReady: true,
      isPreview: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      searchParams: new URLSearchParams(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';
```

### Step 4: Update package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Step 5: Create Test Utilities
**File:** `src/__tests__/utils/test-utils.tsx`
```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { AuthProvider } from '@/components/providers';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <AuthProvider>{children}</AuthProvider>
    </SWRConfig>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Step 6: Create Mock Factories
**File:** `src/__tests__/factories/user.factory.ts`
```typescript
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  ...overrides,
});

export const createMockAuthState = (overrides = {}) => ({
  user: createMockUser(),
  isLoading: false,
  error: null,
  isAuthenticated: true,
  ...overrides,
});
```

### Step 7: Create API Mocks
**File:** `src/__tests__/mocks/handlers.ts`
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/login', async () => {
    return HttpResponse.json({
      accessToken: 'mock-token',
      user: { id: '1', email: 'test@example.com' },
    });
  }),
  http.get('/api/products', () => {
    return HttpResponse.json([
      { id: '1', name: 'Product 1', price: 100 },
    ]);
  }),
];
```

---

## Test File Structure

Recommended folder structure:
```
src/
├── __tests__/
│   ├── unit/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── store/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth/
│   │   ├── products/
│   │   └── flows/
│   ├── components/
│   │   ├── layout/
│   │   ├── forms/
│   │   └── ui/
│   ├── utils/
│   │   ├── test-utils.tsx
│   │   ├── mocks.ts
│   │   └── setup.ts
│   ├── factories/
│   │   ├── user.factory.ts
│   │   ├── product.factory.ts
│   │   └── ...
│   └── mocks/
│       ├── handlers.ts
│       └── server.ts
├── lib/
├── components/
└── ...
```

---

## Testing Priority Order

### Week 1: Setup & Authentication (Critical)
1. Install and configure Jest
2. Set up test utilities and mocks
3. Write auth service tests (unit)
4. Write auth hooks tests (unit)
5. Write login/register form tests (component)

**Target:** 15-20 tests, pass all

### Week 2: Products & Items (Critical)
1. Product service tests (unit)
2. Item service tests (unit)
3. Product hooks tests (unit)
4. Product card component tests
5. Products catalog component tests

**Target:** 20-25 tests, pass all

### Week 3: API & Integration (High Priority)
1. API client tests (unit)
2. API builder tests (unit)
3. Auth flow integration tests
4. Product CRUD integration tests

**Target:** 15-20 tests, pass all

### Week 4: Components & Pages (High Priority)
1. Form components tests
2. Page component tests
3. Layout component tests
4. Error/loading state tests

**Target:** 20-25 tests, pass all

### Week 5: Remaining & Coverage (Medium Priority)
1. Remaining component tests
2. Utility function tests
3. Configuration tests
4. Edge cases and error scenarios

**Target:** 15-20 tests, reach 80%+ coverage

---

## CI/CD Integration

### GitHub Actions Workflow
**File:** `.github/workflows/test.yml`
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Validation Checklist

### Pre-Implementation
- [ ] Project team agrees on test framework choice
- [ ] Development environment is clean
- [ ] All current code is committed

### Post-Installation
- [ ] All dependencies installed successfully
- [ ] Jest configuration file created
- [ ] Test scripts added to package.json
- [ ] `npm run test` command works
- [ ] Test utilities and mocks created
- [ ] IDE recognizes test files

### First Tests
- [ ] First unit test written and passes
- [ ] First component test written and passes
- [ ] Coverage report generated
- [ ] CI/CD can run tests

### Full Implementation
- [ ] 80%+ line coverage achieved
- [ ] All critical paths tested
- [ ] All error scenarios covered
- [ ] Test suite runs in < 30 seconds
- [ ] CI/CD integration complete

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Jest conflicts with Next.js 16 | Low | Use latest ts-jest, follow Next.js testing guide |
| Test environment issues | Medium | Use jsdom, proper mocks for Next.js APIs |
| Slow test suite | Medium | Use test parallelization, optimize mocks |
| Coverage threshold too high | Low | Start at 80%, adjust based on complexity |
| Flaky tests | Medium | Avoid hardcoded delays, use proper async patterns |
| Mock maintenance | Medium | Use factories, keep mocks DRY |

---

## Success Metrics

- [ ] All tests pass on every commit
- [ ] Coverage reaches 80%+
- [ ] Test suite completes in < 30 seconds
- [ ] No flaky tests (100% pass rate)
- [ ] CI/CD blocks merge on test failure
- [ ] New features include tests (100% of PRs)

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Setup & Auth Tests | 1 week | Not Started |
| Products & Items | 1 week | Not Started |
| API & Integration | 1 week | Not Started |
| Components & Pages | 1 week | Not Started |
| Remaining & Polish | 1 week | Not Started |
| **Total** | **5 weeks** | - |

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Mock Service Worker](https://mswjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)

---

**Document Status:** Draft - Ready for review and approval
**Last Updated:** 2026-03-31
