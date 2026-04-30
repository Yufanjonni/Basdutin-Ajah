import { Bell, LogIn, LogOut, Menu, X } from 'lucide-react'
import { getNavItems } from '../data/navigation'
import { Button } from './ui/Button'
import type { Page, User } from '../types'
import { useState } from 'react'

type TopNavProps = {
  activeUser: User | null
  isGuest?: boolean
  page: Page
  onNavigate: (page: Page) => void
  onLogout: () => void
}

export function TopNav({ activeUser, isGuest = false, page, onNavigate, onLogout }: TopNavProps) {
  const navItems = getNavItems(activeUser?.role ?? (isGuest ? 'guest' : null))
  const showNav = !!activeUser || isGuest
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e8f0] bg-white">
      <div className="flex h-12 items-center justify-between px-3 md:px-4 max-w-[1400px] mx-auto">
        <Button 
          variant="ghost" 
          className="h-9 w-9 p-1"
          onClick={() => onNavigate(activeUser ? 'dashboard' : isGuest ? 'events' : 'login')}
        >
          <img
            src="/Tik.png"
            alt="TikTakTuk"
            className="h-6 w-6 object-contain"
          />
        </Button>

        {showNav && (
          <>
            <nav className={`hidden md:flex items-center gap-0.5 overflow-x-auto max-w-[calc(100vw-260px)] ${!activeUser && isGuest ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
              {navItems.map((item) => (
                <Button
                  key={item.page}
                  variant={page === item.page ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-xs px-2 py-1 h-8 whitespace-nowrap"
                  onClick={() => onNavigate(item.page)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
            
            <div className="flex md:hidden items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {activeUser && (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bell className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1 text-xs"
                onClick={() => activeUser ? onLogout() : onNavigate('login')}
              >
                {activeUser ? <LogOut className="h-3.5 w-3.5" /> : <LogIn className="h-3.5 w-3.5" />}
                <span className="hidden lg:inline">{activeUser ? 'Logout' : 'Login'}</span>
              </Button>
              {!activeUser && isGuest && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onNavigate('registerRole')}
                >
                  Registrasi
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {menuOpen && showNav && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-[#e2e8f0]">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-1 p-2">
              {navItems.map((item) => (
                <Button
                  key={item.page}
                  variant={page === item.page ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => { onNavigate(item.page); setMenuOpen(false); }}
                >
                  {item.label}
                </Button>
              ))}
              <hr className="my-2" />
              <Button variant="ghost" className="justify-start text-red-600" onClick={() => activeUser ? onLogout() : onNavigate('login')}>
                {activeUser ? <LogOut className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                {activeUser ? 'Logout' : 'Login'}
              </Button>
              {!activeUser && isGuest && (
                <Button variant="secondary" className="justify-start" onClick={() => { onNavigate('registerRole'); setMenuOpen(false); }}>
                  Registrasi
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
