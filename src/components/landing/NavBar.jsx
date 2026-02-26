import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Categories', href: '#categories' },
]

export default function NavBar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(95%, 1100px)',
                zIndex: 100,
                borderRadius: 'var(--radius-pill)',
                border: `1px solid ${scrolled ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
                background: scrolled ? 'rgba(5, 5, 5, 0.92)' : 'rgba(5, 5, 5, 0.6)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(78,255,160,0.03)' : 'none',
            }}
        >
            <div style={{
                padding: '0 24px',
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={16} color="var(--quai-green)" />
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 800,
                        fontSize: 18,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                    }}>
                        <span style={{ color: 'var(--quai-green)' }}>Q</span>uaiWork
                    </span>
                </a>

                {/* Desktop nav links */}
                <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {links.map(l => (
                        <a
                            key={l.href}
                            href={l.href}
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                padding: '6px 16px',
                                borderRadius: 'var(--radius-pill)',
                                transition: 'color 0.15s ease, background 0.15s ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--text-primary)'
                                e.currentTarget.style.background = 'var(--bg-elevated)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--text-secondary)'
                                e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Network indicator */}
                    <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--quai-green)' }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>Cyprus-1</span>
                    </div>

                    <a href="#cta" className="btn-primary hide-mobile" style={{ fontSize: 12, padding: '8px 20px' }}>
                        Launch App →
                    </a>

                    {/* Mobile menu toggle */}
                    <button
                        className="show-mobile-only"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: 4,
                        }}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            padding: '8px 24px 20px',
                            borderTop: '1px solid var(--border-subtle)',
                        }}>
                            {links.map(l => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px 0',
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: 14,
                                        fontWeight: 500,
                                        borderBottom: '1px solid var(--border-subtle)',
                                    }}
                                >
                                    {l.label}
                                </a>
                            ))}
                            <a href="#cta" className="btn-primary" style={{ marginTop: 16, fontSize: 13, display: 'inline-flex' }}>
                                Launch App →
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
