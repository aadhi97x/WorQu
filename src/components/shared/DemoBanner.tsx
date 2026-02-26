import { useDemo } from '@/contexts/DemoContext'
import { useNavigate } from 'react-router-dom'
import { Zap, X } from 'lucide-react'

export function DemoBanner() {
    const { isDemo, demoRole, exitDemo } = useDemo()
    const navigate = useNavigate()

    if (!isDemo) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            height: 40,
            background: 'linear-gradient(90deg, rgba(78,255,160,0.15) 0%, rgba(78,255,160,0.08) 50%, rgba(78,255,160,0.15) 100%)',
            borderBottom: '1px solid var(--quai-green-dim)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--quai-green)',
                    animation: 'pulseGreen 2s ease-in-out infinite',
                    boxShadow: 'var(--glow-green-xs)'
                }} />
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--quai-green)',
                    letterSpacing: '0.06em',
                    fontWeight: 500,
                }}>
                    DEMO MODE
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    — You are previewing as a {demoRole}. No real transactions.
                </span>
            </div>

            <button
                onClick={() => {
                    exitDemo()
                    navigate('/')
                }}
                style={{
                    position: 'absolute',
                    right: 16,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
                <X size={14} /> Exit Demo
            </button>
        </div>
    )
}
