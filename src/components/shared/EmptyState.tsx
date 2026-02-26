import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  icon: ReactNode
  title: string
  description: string
  action?: { label: string, href: string }
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', gap: 12, textAlign: 'center'
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', marginBottom: 4
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', maxWidth: 320, margin: 0 }}>
        {description}
      </p>
      {action && (
        <Link to={action.href} className="btn-primary" style={{ marginTop: 8, textDecoration: 'none' }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
