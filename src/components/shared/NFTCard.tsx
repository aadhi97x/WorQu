import { Check } from 'lucide-react'
import { shortenAddress, formatDate } from '@/lib/quai'

interface Props {
  tokenId: number
  jobTitle: string
  counterpartyAddress: string
  amountQuai: string
  status: 'open' | 'active' | 'completed' | 'disputed' | 'pending' | 'refunded'
  completedAt: number
  quaiscanUrl: string
  index?: number
}

export function NFTCard({ tokenId, jobTitle, completedAt, index = 0 }: Props) {
  return (
    <div
      className={`card card-interactive animate-fade-up delay-${(index % 8) + 1}`}
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div style={{
        margin: '-20px -20px 16px -20px',
        height: 60,
        background: 'linear-gradient(135deg, var(--quai-green-10), var(--status-active-bg))',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', padding: '0 20px'
      }}>
        <div style={{
          width: 32, height: 32, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'var(--quai-green)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: 28, height: 28, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'var(--bg-elevated)'
          }} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {jobTitle}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          NFT #{tokenId}
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Completed: {formatDate(completedAt)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>Work Agreement</span>
        <Check size={14} color="var(--quai-green)" />
      </div>
    </div>
  )
}
