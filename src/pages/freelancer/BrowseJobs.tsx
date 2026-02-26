import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import { useProfile } from '@/hooks/useProfile'
import { JobListingCard } from '@/components/freelancer/JobListingCard'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export function BrowseJobs() {
  const { getAllJobs } = useContracts()
  const { profile } = useProfile()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchJobs = async () => {
      try {
        const all = await getAllJobs()
        if (mounted) {
          let openJobs = all.filter((j: any) => j.status === 'open')

          // AI Match Scoring
          if (profile?.aiSkills && profile.aiSkills.length > 0) {
            const userSkills = profile.aiSkills.map(s => s.toLowerCase())

            openJobs = openJobs.map(job => {
              const textToAnalyze = `${job.title} ${job.description} ${job.category} ${(job.skills || []).join(' ')}`.toLowerCase()

              let matchCount = 0
              userSkills.forEach(skill => {
                if (textToAnalyze.includes(skill)) matchCount++
              })

              // Base score 40-60, + matches
              let score = 50 + (matchCount * 15)
              score = Math.min(score, 98) // Cap at 98%

              if (matchCount > 0) {
                // Add some deterministic randomness
                score += (job.id % 3)
              } else {
                score = 0
              }

              return { ...job, matchScore: score }
            })

            // Sort by match score descending
            openJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
          } else {
            // Newest first by default
            openJobs.sort((a, b) => Number(b.id) - Number(a.id))
          }

          setJobs(openJobs)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          toast.error("Failed to fetch jobs")
          setLoading(false)
        }
      }
    }
    fetchJobs()
    return () => { mounted = false }
  }, [getAllJobs, profile])

  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 40 }}>
      {/* Sidebar Filters */}
      <div className="glass-card" style={{ padding: 20, position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="section-label">FILTERS</div>
          <button style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Clear All
          </button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Category</div>
          {['Development', 'Design', 'Writing', 'Web3'].map(cat => (
            <label key={cat} style={{ display: 'flex', gap: 8, padding: '6px 0', cursor: 'pointer', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--quai-green)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat}</span>
            </label>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Budget (QUAI)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MIN</div>
              <input type="number" className="input" style={{ padding: '6px 8px', fontSize: 13 }} placeholder="0" />
            </div>
            <span style={{ color: 'var(--text-muted)', marginTop: 16 }}>–</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>MAX</div>
              <input type="number" className="input" style={{ padding: '6px 8px', fontSize: 13 }} placeholder="Any" />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>Experience Level</div>
          {['Entry', 'Intermediate', 'Expert'].map(level => (
            <label key={level} style={{ display: 'flex', gap: 8, padding: '6px 0', cursor: 'pointer', alignItems: 'center' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--quai-green)' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{level}</span>
            </label>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 10 }}>Apply Filters</button>
      </div>

      {/* Main Content */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            {loading ? 'Loading jobs...' : `${jobs.length} jobs found`}
          </div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            Sort by: Recommended <ChevronDown size={12} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loading ? (
            [1, 2, 3, 4, 5].map(i => <div key={i} className="glass-card skeleton" style={{ height: 160 }} />)
          ) : jobs.length === 0 ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              No jobs found matching your criteria.
            </div>
          ) : (
            <AnimatePresence>
              {jobs.map(job => (
                <motion.div
                  key={job.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <JobListingCard
                    job={job}
                    proposalsCount={0}
                    matchScore={job.matchScore}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}

