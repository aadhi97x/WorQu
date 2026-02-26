import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { QuaiAmount } from '@/components/shared/QuaiAmount'
import { timeAgo, shortenAddress, formatDate } from '@/lib/quai'

interface Props {
  job: any
  proposalsCount: number
  index?: number
  matchScore?: number
}

export function JobListingCard({ job, proposalsCount, index = 0, matchScore }: Props) {
  const statusMap: Record<number, any> = {
    0: 'open', 1: 'open', 2: 'active', 3: 'completed', 4: 'disputed', 5: 'refunded'
  }
  const status = statusMap[job.status] || 'open'

  return (
    <Link to={`/freelancer/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className={`glass-card card-interactive animate-fade-up delay-${(index % 8) + 1}`}
        style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {/* Row 1 — Title + Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {job.title}
            </div>
            {matchScore !== undefined && matchScore > 10 && (
              <span style={{
                background: 'rgba(78, 255, 160, 0.1)',
                color: '#a4ffcf',
                border: '1px solid var(--quai-green-dim)',
                boxShadow: '0 0 10px rgba(78, 255, 160, 0.4)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                ✨ {matchScore}% AI MATCH
              </span>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Row 2 — Client & Post Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="address">{shortenAddress(job.client)}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posted {timeAgo(Number(job.createdAt))}</span>
        </div>

        {/* Row 3 — Description snippet */}
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {job.description}
        </div>

        {/* Row 4 — Skills tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0' }}>
          {(job.skills || ['React', 'Solidity', 'Web3']).map((skill: string) => (
            <span key={skill} style={{
              background: 'var(--quai-green-10)', color: '#a4ffcf',
              borderRadius: 'var(--radius-pill)', padding: '3px 8px', fontFamily: 'var(--font-mono)', fontSize: 11
            }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Row 5 — Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="amount-quai" style={{ fontSize: 18, fontWeight: 700, transition: 'color var(--transition-fast)' }}>
              {job.budget} <span style={{ fontSize: '80%', color: 'var(--text-muted)', fontWeight: 400 }}>QUAI</span>
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Due {formatDate(Number(job.deadline))}
            </span>
          </div>

          <div className="btn btn-ghost btn-sm" style={{ pointerEvents: 'none' }}>
            View Details →
          </div>
        </div>
      </div>
    </Link>
  )
}
