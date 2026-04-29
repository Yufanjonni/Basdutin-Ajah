import { getNavItems } from '../data/navigation'
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
    <header className="top-nav">
      <div className="nav-inner">
        <button className="nav-brand" type="button" onClick={() => onNavigate(activeUser ? 'dashboard' : 'login')}>
          <span className="nav-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </span>
          <span className="nav-brand-text">TikTakTuk</span>
        </button>

        <nav className="nav-menu" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <button
              className={page === item.page ? 'active' : ''}
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
            >
              {item.label}
            </button>
          ))}
          {activeUser && (
            <button type="button" onClick={onLogout} className="logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}