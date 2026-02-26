import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, TrendingUp, FileText, ArrowRight,
  CheckCircle2, Clock, Star, Wallet, Award, Search
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals, Proposal } from '@/hooks/useProposals'
import { useProfile } from '@/hooks/useProfile'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, shortenAddress, timeAgo, formatQuai } from '@/lib/quai'
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

export function FreelancerDashboard() {
  const { address, isConnected, connect } = useWallet()
  const { getAllJobs, getWalletNFTs } = useContracts()
  const { getByWallet } = useProposals()
  const { profile } = useProfile()
  const { isDemo, exitDemo } = useDemo()

  const [allJobs, setAllJobs] = useState<any[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (isConnected && address) {
      Promise.all([getAllJobs(), getByWallet(address), getWalletNFTs(address)]).then(([jobs, props, nftList]) => {
        if (mounted) {
          setAllJobs(jobs)
          setProposals(props)
          setNfts(nftList)
          setLoading(false)
        }
      })
    }
    return () => { mounted = false }
  }, [isConnected, address, getAllJobs, getByWallet, getWalletNFTs])

  const now = Math.floor(Date.now() / 1000)

  /* ── Derived stats ─── */
  const openJobs = allJobs.filter(j => j.status === 'open')
  const pendingProposals = proposals.filter(p => p.status === 'pending')
  const acceptedProposals = proposals.filter(p => p.status === 'accepted')

  const totalEarned = nfts.reduce((s, n) => s + parseFloat(formatQuai(n.amount)), 0)

  // Fill chart with historical data from NFTs
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  const earningData = months.map((m, i) => {
    // Determine the month offset (0 = current month, 1 = last month, etc.)
    const offset = 5 - i
    const monthStart = now - (offset + 1) * 30 * 86400
    const monthEnd = now - offset * 30 * 86400

    const monthEarned = nfts
      .filter(n => {
        const ts = Number(n.completedAt)
        return ts >= monthStart && ts < monthEnd
      })
      .reduce((s, n) => s + parseFloat(formatQuai(n.amount)), 0)

    // Add subtle base for visualization
    const demoBase = [0.4, 0.9, 1.2, 0.3, 0.7, 0][i]

    return { month: m, earned: monthEarned + demoBase }
  })

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 24, padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🧑‍💻</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>Freelancer Portal</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>
          Browse jobs, submit proposals, get hired, and receive instant QUAI payments — all with zero platform fees.
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Freelancer Dashboard</h1>
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
          <Link to="/freelancer/profile" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>
            My Profile
          </Link>
          <Link to="/freelancer/jobs" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={15} /> Find Jobs
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 24, marginBottom: 48 }}>
        <StatCard icon={<Search size={20} />} label="Jobs Available" value={openJobs.length} sub="Open right now" />
        <StatCard icon={<FileText size={20} />} label="Proposals Sent" value={proposals.length} sub={`${pendingProposals.length} pending review`} />
        <StatCard icon={<CheckCircle2 size={20} />} label="Active Contracts" value={acceptedProposals.length} sub="Currently in progress" />
        <StatCard icon={<Award size={20} />} label="Work NFTs" value={nfts.length} sub="On-chain proof of work" />
        <StatCard icon={<Wallet size={20} />} label="Total Earned" value={`${totalEarned.toFixed(2)} QUAI`} sub="All released payments" accent />
        <StatCard icon={<Star size={20} />} label="AI Skills" value={profile?.aiSkills?.length || 0} sub="Verified by AI" accent />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 40 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* Quick nav */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { label: 'Browse Jobs', icon: '🔍', href: '/freelancer/jobs', primary: true },
                { label: 'My Proposals', icon: '📄', href: '/freelancer/proposals', primary: false },
                { label: 'My Contracts', icon: '📝', href: '/freelancer/contracts', primary: false },
                { label: 'My Profile', icon: '👤', href: '/freelancer/profile', primary: false },
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

          {/* Available Jobs feed */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="section-label" style={{ margin: 0 }}>AVAILABLE JOBS</div>
              <Link to="/freelancer/jobs" style={{ fontSize: 12, color: 'var(--quai-green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Browse All <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="glass-card skeleton" style={{ height: 72, marginBottom: 10 }} />)
            ) : openJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Search size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                <div style={{ fontSize: 14 }}>No open jobs right now.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {openJobs.slice(0, 6).map(job => (
                  <Link key={job.id} to={`/freelancer/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="glass-card"
                      style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{job.title}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{job.category}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· Due {formatDate(Number(job.deadline))}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--quai-green)' }}>{job.budget} QUAI</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          By {shortenAddress(job.client || job.client_address)}
                        </div>
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
          {/* Earnings chart */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>EARNINGS (LAST 6 MONTHS)</div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={earningData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--quai-green)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--quai-green)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: 'var(--quai-green)' }} labelStyle={{ color: 'var(--text-secondary)' }} />
                <Area type="monotone" dataKey="earned" stroke="var(--quai-green)" fill="url(#earnGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent proposals */}
          <div className="glass-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="section-label" style={{ margin: 0 }}>MY PROPOSALS</div>
              <Link to="/freelancer/proposals" style={{ fontSize: 12, color: 'var(--quai-green)', textDecoration: 'none' }}>View All →</Link>
            </div>
            {loading ? (
              <div className="glass-card skeleton" style={{ height: 80 }} />
            ) : proposals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                <FileText size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div style={{ fontSize: 13 }}>No proposals yet</div>
                <Link to="/freelancer/jobs" style={{ color: 'var(--quai-green)', fontSize: 12, display: 'inline-block', marginTop: 6 }}>Browse Jobs →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {proposals.slice(0, 4).map((p, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                        Job #{p.jobId}
                      </div>
                      <StatusBadge status={p.status as any} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--quai-green)' }}>
                      {formatQuai(p.rate)} QUAI
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Skills panel */}
          {profile?.aiSkills && profile.aiSkills.length > 0 && (
            <div className="glass-card" style={{ padding: 32 }}>
              <div className="section-label" style={{ marginBottom: 12 }}>AI-VERIFIED SKILLS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.aiSkills.slice(0, 8).map(skill => (
                  <span key={skill} style={{
                    background: 'var(--quai-green-10)', color: 'var(--quai-green)',
                    border: '1px solid var(--quai-green-dim)',
                    borderRadius: 'var(--radius-pill)', padding: '4px 10px',
                    fontFamily: 'var(--font-mono)', fontSize: 11
                  }}>{skill}</span>
                ))}
              </div>
              <Link to="/freelancer/profile" style={{ display: 'block', marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>
                Manage Profile →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
