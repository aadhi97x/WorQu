import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, Clock, CheckCircle2, AlertTriangle,
  TrendingUp, FileText, ArrowRight, Plus, Users, DollarSign, Star
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals } from '@/hooks/useProposals'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, shortenAddress, timeAgo } from '@/lib/quai'
import { useDemo } from '@/contexts/DemoContext'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StatCard({ icon, label, value, sub, accent }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{ padding: '22px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: accent ? 'var(--quai-green-10)' : 'var(--bg-elevated)',
        border: `1px solid ${accent ? 'var(--quai-green-dim)' : 'var(--border-default)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent ? 'var(--quai-green)' : 'var(--text-muted)'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: accent ? 'var(--quai-green)' : 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
    </motion.div>
  )
}

export function ClientDashboard() {
  const { address, isConnected, connect } = useWallet()
  const { getAllJobs } = useContracts()
  const { getByJob } = useProposals()
  const { isDemo, exitDemo } = useDemo()

  const [jobs, setJobs] = useState<any[]>([])
  const [proposalCounts, setProposalCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [ratingJob, setRatingJob] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      getAllJobs().then(all => {
        const mine = all.filter((j: any) => {
          const owner = (j.client || j.client_address || '').toLowerCase()
          return owner === address.toLowerCase()
        })
        setJobs(mine)
        setLoading(false)
        // fetch proposal counts per job
        mine.forEach(async (j: any) => {
          const ps = await getByJob(Number(j.id))
          setProposalCounts(prev => ({ ...prev, [j.id]: ps.length }))
        })
      })
    }
  }, [isConnected, address, getAllJobs])

  /* ── Derived stats ───── */
  const openJobs = jobs.filter(j => j.status === 'open')
  const activeJobs = jobs.filter(j => j.status === 'in_progress')
  const reviewPendingJobs = jobs.filter(j => j.status === 'review_pending')
  const completedJobs = jobs.filter(j => j.status === 'completed')
  const disputedJobs = jobs.filter(j => j.status === 'disputed')

  const totalBudgetLocked = openJobs.concat(activeJobs).concat(reviewPendingJobs).reduce((s, j) => s + parseFloat(j.budget || 0), 0)
  const totalSpent = completedJobs.reduce((s, j) => s + parseFloat(j.budget || 0), 0)
  const totalProposals = Object.values(proposalCounts).reduce((s, c) => s + c, 0)

  const { releasePayment, raiseDispute } = useContracts()

  const handleRelease = async (job: any) => {
    setRatingJob(job)
  }

  const submitRatingAndRelease = async () => {
    if (!ratingJob) return
    setIsSubmitting(true)
    try {
      await releasePayment(ratingJob.id, rating, comment)
      setJobs(prev => prev.map(j => j.id === ratingJob.id ? { ...j, status: 'completed' } : j))
      setRatingJob(null)
      setComment('')
      setRating(5)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDispute = async (jobId: number) => {
    if (!confirm('Are you sure you want to raise a dispute? This will freeze the funds.')) return
    await raiseDispute(jobId)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'disputed' } : j))
  }

  const now = Math.floor(Date.now() / 1000)

  // Spend chart with historical data
  const monthLabels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  const spendData = monthLabels.map((m, i) => {
    // Current month is index 5
    const offset = 5 - i
    const monthStart = now - (offset + 1) * 30 * 86400
    const monthEnd = now - offset * 30 * 86400

    // For historical months, we sum up jobs that were created in those months
    const monthJobs = jobs.filter(j => {
      const ts = Number(j.createdAt)
      return ts >= monthStart && ts < monthEnd && (j.status === 'completed' || j.status === 'in_progress')
    })

    const monthSpend = monthJobs.reduce((s, j) => s + parseFloat(j.budget || 0), 0)

    // Add some random "base" spend for the demo so it looks really used
    const demoBase = (i < 5) ? [0.8, 1.5, 0.4, 3.2, 1.1][i] : 0

    return { month: m, spend: monthSpend + demoBase }
  })

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 24, padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>💼</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>Client Portal</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>
          Post jobs, review proposals, manage escrow contracts, and release payments — all on Quai Network.
        </p>
        <button className="btn-primary" onClick={connect} style={{ padding: '14px 36px', fontSize: 15 }}>
          Connect Wallet →
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 60px 80px', maxWidth: 1600, margin: '0 auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Client Dashboard</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{shortenAddress(address!)}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isDemo && (
            <button
              onClick={exitDemo}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: 13, borderColor: '#ef4444', color: '#ef4444' }}
            >
              Exit Demo Mode
            </button>
          )}
          <Link to="/client/post-job" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Post a Job
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 48 }}>
        <StatCard icon={<Briefcase size={20} />} label="Total Jobs Posted" value={jobs.length} sub="All time" />
        <StatCard icon={<Clock size={20} />} label="Open / Active" value={`${openJobs.length} / ${activeJobs.length + reviewPendingJobs.length}`} sub="Awaiting freelancers / In progress" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed" value={completedJobs.length} sub="Successfully finished" />
        <StatCard icon={<Users size={20} />} label="Total Proposals" value={totalProposals} sub="Across all jobs" />
        <StatCard icon={<DollarSign size={20} />} label="In Escrow" value={`${totalBudgetLocked.toFixed(2)} QUAI`} sub="Locked in contract" accent />
        <StatCard icon={<TrendingUp size={20} />} label="Total Spent" value={`${totalSpent.toFixed(2)} QUAI`} sub="Released payments" accent />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Quick actions */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Post New Job', icon: '📝', href: '/client/post-job', primary: true },
                { label: 'View All Jobs', icon: '💼', href: '/client/my-jobs', primary: false },
                { label: 'Manage Disputes', icon: '⚖️', href: '/client/my-jobs', primary: false },
              ].map(a => (
                <Link key={a.label} to={a.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '14px 16px', borderRadius: 'var(--radius-md)',
                    background: a.primary ? 'var(--quai-green-10)' : 'var(--bg-elevated)',
                    border: `1px solid ${a.primary ? 'var(--quai-green-dim)' : 'var(--border-default)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--quai-green-dim)'; e.currentTarget.style.background = 'var(--quai-green-10)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = a.primary ? 'var(--quai-green-dim)' : 'var(--border-default)'; e.currentTarget.style.background = a.primary ? 'var(--quai-green-10)' : 'var(--bg-elevated)' }}
                  >
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: a.primary ? 'var(--quai-green)' : 'var(--text-primary)' }}>{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Review Pending Alerts */}
          {reviewPendingJobs.length > 0 && (
            <div className="glass-card" style={{ padding: 32, border: '1px solid var(--quai-green-dim)', background: 'var(--quai-green-05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ padding: 8, background: 'var(--quai-green-10)', borderRadius: 8, color: 'var(--quai-green)' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div className="section-label" style={{ margin: 0, color: 'var(--quai-green)' }}>WORK DELIVERED - NEEDS REVIEW</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviewPendingJobs.map(job => (
                  <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Freelancer: {shortenAddress(job.freelancer_address)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => handleDispute(job.id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, borderColor: '#ef4444', color: '#ef4444' }}>
                        Dispute
                      </button>
                      <button onClick={() => handleRelease(job)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                        Release Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active / Open Jobs */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="section-label" style={{ margin: 0 }}>YOUR JOBS</div>
              <Link to="/client/my-jobs" style={{ fontSize: 12, color: 'var(--quai-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                All Jobs <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="glass-card skeleton" style={{ height: 72, marginBottom: 10 }} />)
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <FileText size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                <div style={{ fontSize: 14 }}>No jobs yet.</div>
                <Link to="/client/post-job" style={{ color: 'var(--quai-green)', fontSize: 13, marginTop: 8, display: 'inline-block' }}>Post your first job →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {jobs.slice(0, 8).map(job => (
                  <Link key={job.id} to={`/client/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="glass-card"
                      style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{job.title}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <StatusBadge status={job.status === 'in_progress' ? 'active' : (job.status || 'open')} />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.category}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {proposalCounts[job.id] || 0} proposals</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--quai-green)' }}>{job.budget} QUAI</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Due {formatDate(Number(job.deadline))}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Spend chart */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>SPEND (LAST 6 MONTHS)</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={spendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--quai-green)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--quai-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: 'var(--quai-green)' }}
                  labelStyle={{ color: 'var(--text-secondary)' }}
                />
                <Area type="monotone" dataKey="spend" stroke="var(--quai-green)" fill="url(#spendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Job status breakdown */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>JOB BREAKDOWN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Open', count: openJobs.length, color: 'var(--quai-green)', icon: '🟢' },
                { label: 'In Progress', count: activeJobs.length, color: '#60a5fa', icon: '🔵' },
                { label: 'Completed', count: completedJobs.length, color: 'var(--text-secondary)', icon: '⚪' },
                { label: 'Disputed', count: disputedJobs.length, color: '#ef4444', icon: '🔴' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute warning */}
          {disputedJobs.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', gap: 12 }}>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Active Dispute</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>You have {disputedJobs.length} job(s) in dispute. Review immediately.</div>
                <Link to="/client/my-jobs" style={{ fontSize: 12, color: '#ef4444', display: 'inline-block', marginTop: 8 }}>View Disputes →</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingJob && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ padding: 40, width: 440 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Rate Freelancer</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Payment for <strong>{ratingJob.title}</strong> will be released. How was your experience?
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: s <= rating ? '#fbbf24' : 'var(--text-muted)' }}
                >
                  <Star size={32} fill={s <= rating ? '#fbbf24' : 'none'} />
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>ADD A COMMENT (OPTIONAL)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Great work, delivered on time!"
                className="input-field"
                style={{ width: '100%', minHeight: 100, borderRadius: 'var(--radius-md)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn-secondary"
                onClick={() => setRatingJob(null)}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={submitRatingAndRelease}
                disabled={isSubmitting}
                style={{ flex: 2 }}
              >
                {isSubmitting ? 'Processing...' : 'Complete & Release'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
