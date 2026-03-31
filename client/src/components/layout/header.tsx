import Link from 'next/link'
import { UserBadge } from './user-badge'
import { AuthNav } from './auth-nav'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href="/" className="font-bold text-lg">
          App
        </Link>
        <nav className="ml-8 flex gap-4 items-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <AuthNav />
        </nav>
        <div className="ml-auto">
          <UserBadge />
        </div>
      </div>
    </header>
  )
}
