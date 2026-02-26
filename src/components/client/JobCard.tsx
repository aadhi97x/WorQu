import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { QuaiAmount } from '@/components/shared/QuaiAmount'
import { shortenAddress, formatDate } from '@/lib/quai'

interface Props {
  job: any
  proposalsCount: number
  onReleasePayment?: () => void
  onDispute?: () => void
}

export function JobCard({ job, proposalsCount, onReleasePayment, onDispute }: Props) {
  const statusMap: Record<number, any> = {
    0: 'open', 1: 'open', 2: 'active', 3: 'completed', 4: 'disputed', 5: 'refunded'
  }
  const status = statusMap[job.status] || 'open'

  return (
    <div className="glass-card" style={{ padding: 20 }}>
      {/* Row 1 — Title + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          {job.title}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Row 2 — Metrics Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
        borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 0', marginBottom: 16
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Proposals</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--quai-green)' }}>{proposalsCount}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Budget</span>
          <QuaiAmount amount={job.budget} size="sm" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Deadline</span>
          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{formatDate(Number(job.deadline))}</span>
        </div>
      </div>

      {(status === 'active' || status === 'completed') && (
        <div style={{ marginBottom: 16, fontSize: 13, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            Hired: <span className="address" style={{ fontFamily: 'var(--font-mono)' }}>{shortenAddress(job.freelancer || job.freelancer_address)}</span>
          </div>
          <div style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--quai-green-10)', color: 'var(--quai-green)', fontSize: 10, fontWeight: 700, border: '1px solid var(--quai-green-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>WORK AGREEMENT NFT</span>
            <span style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>#{job.id}</span>
          </div>
        </div>
      )}

      {/* Row 3 — Actions */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {status === 'open' && (
          <>
            <Link to={`/client/jobs/${job.id}`} className="btn btn-primary btn-sm">
              View Proposals
            </Link>
            <Link to={`/client/jobs/${job.id}`} className="btn btn-ghost btn-sm">
              Manage →
            </Link>
          </>
        )}

        {status === 'active' && (
          <>
            <button onClick={onReleasePayment} className="btn btn-primary btn-sm">
              Release Payment
            </button>
            <button onClick={onDispute} className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>
              Dispute
            </button>
          </>
        )}

        {status === 'completed' && (
          <Link to={`/client/jobs/${job.id}`} className="btn btn-secondary btn-sm">
            View Details →
          </Link>
        )}

        {status === 'disputed' && (
          <button className="btn btn-danger btn-sm">
            View Dispute
          </button>
        )}
      </div>
    </div>
  )
}
