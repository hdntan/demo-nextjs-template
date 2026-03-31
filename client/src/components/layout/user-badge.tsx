'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export function UserBadge() {
  const { user, isAuthenticated, isHydrated, logout } = useAuth()
  const router = useRouter()

  if (!isHydrated) return null

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    )
  }

  async function handleLogout() {
    try {
      await logout()
      router.push('/login')
      router.refresh()
    } catch {
      // logout best-effort
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {user?.name ?? user?.email}
      </Link>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Sign out
      </Button>
    </div>
  )
}
