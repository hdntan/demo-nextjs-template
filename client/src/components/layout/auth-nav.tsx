'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export function AuthNav() {
  const { isAuthenticated, isHydrated } = useAuth()

  if (!isHydrated || !isAuthenticated) return null

  return (
    <Link href="/products/new" className="text-sm text-muted-foreground hover:text-foreground">
      + Add Product
    </Link>
  )
}
