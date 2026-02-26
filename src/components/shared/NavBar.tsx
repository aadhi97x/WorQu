import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { WalletButton } from './WalletButton'
import { useWallet } from '@/hooks/useWallet'
import { useTheme } from '@/contexts/ThemeContext'

export function NavBar({ mode }: { mode: 'client' | 'freelancer' }) {
  const { pathname } = useLocation()
  const { isConnected } = useWallet()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = mode === 'client'
    ? [
      { label: 'Dashboard', path: '/client' },
      { label: 'Post a Job', path: '/client/post-job' },
      { label: 'My Jobs', path: '/client/my-jobs' },
    ]
    : [
      { label: 'Dashboard', path: '/freelancer' },
      { label: 'Find Jobs', path: '/freelancer/jobs' },
      { label: 'My Proposals', path: '/freelancer/proposals' },
      { label: 'Contracts', path: '/freelancer/contracts' },
      { label: 'My Profile', path: '/freelancer/profile' },
    ]

  return (
    <>
      <nav className="navbar">
        <Link to={`/${mode}`} className="navbar-logo">
          Wor<span className="accent">Qu</span>
        </Link>

        {isConnected && (
          <div className="navbar-nav hidden md:flex">
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== `/${mode}` && pathname.startsWith(link.path))
              return (
                <Link key={link.path} to={link.path} className={isActive ? 'active' : ''}>
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        <div className="navbar-spacer" />

        <div className="navbar-actions hidden md:flex" style={{ alignItems: 'center', gap: 10 }}>
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-secondary)',
              transition: 'all 0.2s', flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--quai-green)'; e.currentTarget.style.borderColor = 'var(--quai-green-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)' }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <WalletButton />
        </div>

        {isConnected && (
          <button
            className="md:hidden flex items-center justify-center p-2 text-[var(--text-secondary)] bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} color="var(--text-primary)" />
          </button>
        )}
      </nav>

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        className="md:hidden"
      >
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'absolute', inset: 0, background: 'var(--bg-overlay)',
            opacity: mobileOpen ? 1 : 0, transition: 'opacity 0.3s ease'
          }}
        />
        <div
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 280,
            background: 'var(--bg-surface)', borderRight: '1px solid var(--border-default)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to={`/${mode}`} className="navbar-logo" onClick={() => setMobileOpen(false)}>
              Wor<span className="accent">Qu</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map(link => {
              const isActive = pathname === link.path || (link.path !== `/${mode}` && pathname.startsWith(link.path))
              return (
                <Link
                  key={link.path} to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 16px', borderRadius: 'var(--radius-md)', textDecoration: 'none',
                    background: isActive ? 'var(--bg-elevated)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 500 : 400
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'transparent', border: 'none',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <WalletButton />
          </div>
        </div>
      </div>
    </>
  )
}
