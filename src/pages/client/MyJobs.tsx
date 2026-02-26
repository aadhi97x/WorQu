import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, FileText } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals } from '@/hooks/useProposals'
import { JobCard } from '@/components/client/JobCard'
import { EmptyState } from '@/components/shared/EmptyState'
import toast from 'react-hot-toast'

export function MyJobs() {
  const { address, isConnected } = useWallet()
  const { getAllJobs, releasePayment, raiseDispute } = useContracts()
  const { getByJob } = useProposals()

  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  const fetchJobs = async () => {
    if (!isConnected || !address) return
    try {
      const all = await getAllJobs()
      // local jobs use 'client', Supabase jobs use 'client_address'
      const myJobs = all.filter((j: any) => {
        const jobOwner = (j.client || j.client_address || '').toLowerCase()
        return jobOwner === address.toLowerCase()
      })
      setJobs(myJobs)
    } catch (err) {
      toast.error("Failed to load your jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (mounted) fetchJobs()
    return () => { mounted = false }
  }, [isConnected, address, getAllJobs])

  const handleReleasePayment = async (jobId: number) => {
    try {
      await releasePayment(jobId)
      toast.success('Payment released successfully!')
      fetchJobs()
    } catch (e) {
      toast.error('Failed to release payment')
    }
  }

  const handleDispute = async (jobId: number) => {
    try {
      await raiseDispute(jobId)
      toast.success('Dispute raised')
      fetchJobs()
    } catch (e) {
      toast.error('Failed to raise dispute')
    }
  }

  const tabs = ['All', 'Open', 'Active', 'Completed', 'Disputed']

  const filteredJobs = jobs.filter(j => {
    if (activeTab === 'All') return true
    if (activeTab === 'Open') return j.status === 'open'
    if (activeTab === 'Active') return j.status === 'in_progress'
    if (activeTab === 'Completed') return j.status === 'completed'
    if (activeTab === 'Disputed') return j.status === 'disputed'
    return true
  })

  // We need proposal counts. To do that async, we would ideally fetch proposals for each job.
  // Since we already have getByJob, let's just make sure we are handling its sync/async properly.
  // Actually, getByJob is async now. So `getByJob(Number(job.id)).length` is broken!
  // Let's create a local state for proposal counts or rewrite JobCard to fetch them.
  // For now we'll do proposal counts inside JobCard or preload them. Let's preload.
  const [proposalCounts, setProposalCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    jobs.forEach(async job => {
      const props = await getByJob(job.id)
      setProposalCounts(prev => ({ ...prev, [job.id]: props.length }))
    })
  }, [jobs, getByJob])

  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Jobs</h1>
        <Link to="/client/post-job" className="btn-primary" style={{ textDecoration: 'none' }}>
          Post New Job +
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', marginBottom: 24 }}>
        <div style={{ display: 'flex' }}>
          {tabs.map(tab => {
            const count = tab === 'All' ? jobs.length : jobs.filter(j => {
              if (tab === 'Open') return j.status === 'open'
              if (tab === 'Active') return j.status === 'in_progress'
              if (tab === 'Completed') return j.status === 'completed'
              if (tab === 'Disputed') return j.status === 'disputed'
              return false
            }).length

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 16px', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab ? '2px solid var(--quai-green)' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'color var(--transition-fast)'
                }}
              >
                {tab}
                <span style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-pill)', padding: '1px 7px', fontFamily: 'var(--font-mono)', fontSize: 11
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          Sort by: Newest <ChevronDown size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass-card skeleton" style={{ height: 160 }} />)
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title={`No ${activeTab.toLowerCase()} jobs`}
            description="You don't have any jobs matching this status."
            action={activeTab === 'All' ? { label: 'Post your first job', href: '/client/post-job' } : undefined}
          />
        ) : (
          filteredJobs.map(job => (
            <JobCard
              key={job.id.toString()}
              job={job}
              proposalsCount={proposalCounts[job.id] || 0}
              onReleasePayment={() => handleReleasePayment(Number(job.id))}
              onDispute={() => handleDispute(Number(job.id))}
            />
          ))
        )}
      </div>
    </div>
  )
}
