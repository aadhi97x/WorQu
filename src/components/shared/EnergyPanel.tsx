import { Zap } from 'lucide-react'

export function EnergyPanel() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={16} color="var(--quai-green)" />
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Network Energy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--quai-green)', animation: 'pulseGreen 2s ease-in-out infinite' }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Quai Orchard Testnet · Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Transaction Fee</span>
            <span className="mono" style={{ fontSize: 13, color: 'var(--text-primary)' }}>~0.0001 QUAI</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--bg-elevated)', borderRadius: 9999 }}>
            <div style={{ width: '5%', height: '100%', background: 'var(--quai-green)', borderRadius: 9999 }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Block Time</span>
            <span className="mono" style={{ fontSize: 13, color: 'var(--text-primary)' }}>~1.1s</span>
          </div>
          <div style={{ width: '100%', height: 4, background: 'var(--bg-elevated)', borderRadius: 9999 }}>
            <div style={{ width: '15%', height: '100%', background: 'var(--quai-green)', borderRadius: 9999 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
