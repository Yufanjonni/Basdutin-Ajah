import { Bell, LogOut, Ticket } from 'lucide-react'
import { getNavItems } from '../data/navigation'
import { Button } from './ui/Button'
import type { Page, User } from '../types'

type TopNavProps = {
  activeUser: User | null
  page: Page
  onNavigate: (page: Page) => void
  onLogout: () => void
}

export function TopNav({ activeUser, page, onNavigate, onLogout }: TopNavProps) {
  const navItems = getNavItems(activeUser?.role)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-[1400px] mx-auto">
        <Button 
          variant="ghost" 
          className="gap-2 font-semibold text-lg h-auto p-1.5"
          onClick={() => onNavigate(activeUser ? 'dashboard' : 'login')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Ticket className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">TikTakTuk</span>
        </Button>

        {activeUser && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.page}
                variant={page === item.page ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate(item.page)}
              >
                {item.label}
              </Button>
            ))}
            <Button variant="ghost" size="icon" className="ml-1">
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-[var(--muted-foreground)]"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}