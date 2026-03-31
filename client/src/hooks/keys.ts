// Centralized SWR cache keys — prevents fragmentation
// Convention: keys match API paths for consistency with fetcher

export const KEYS = {
  items: {
    list: '/items',
    detail: (id: string) => `/items/${id}`,
  },
  products: {
    list: '/products',
    detail: (id: number) => `/products/${id}`,
  },
  account: {
    me: '/account/me',
  },
} as const
