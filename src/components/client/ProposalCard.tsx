import { useState, useEffect } from 'react'
import { Check, Github, Linkedin, Globe, FileText, ExternalLink, User, Star, Briefcase, MapPin } from 'lucide-react'
import { timeAgo, shortenAddress } from '@/lib/quai'
import { supabase } from '@/lib/supabase'
import { useWallet } from '@/hooks/useWallet'

interface Props {
  proposal: any
  onAccept: () => void
}

export function ProposalCard({ proposal, onAccept }: Props) {
  const { address } = useWallet()
  const [isHovered, setIsHovered] = useState(false)
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!proposal.freelancerAddress) return
    // Try to load profile from Supabase or localStorage
    const loadProfile = async () => {
      // Check localStorage first (fast)
      const localKey = `quaiwork_profile_${proposal.freelancerAddress.toLowerCase()}`
      const local = localStorage.getItem(localKey)
      if (local) {
        try { setFreelancerProfile(JSON.parse(local)); return } catch { }
      }
      // Fallback to Supabase
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', proposal.freelancerAddress.toLowerCase())
          .maybeSingle()
        if (data) setFreelancerProfile(data)
      } catch { }
    }
    loadProfile()
  }, [proposal.freelancerAddress])

  const name = freelancerProfile?.name || shortenAddress(proposal.freelancerAddress)
  const title = freelancerProfile?.title || ''
  const avatar = freelancerProfile?.avatarUrl || freelancerProfile?.avatar_url || ''
  const skills = freelancerProfile?.skills || freelancerProfile?.ai_skills || freelancerProfile?.aiSkills || []
  const github = freelancerProfile?.githubUrl || freelancerProfile?.github_url || ''
  const linkedin = freelancerProfile?.linkedinUrl || freelancerProfile?.linkedin_url || ''
  const portfolio = freelancerProfile?.portfolioUrl || freelancerProfile?.portfolio_url || ''
  const resume = freelancerProfile?.resumeUrl || freelancerProfile?.resume_url || ''
  const bio = freelancerProfile?.bio || ''
  const experience = freelancerProfile?.experienceLevel || freelancerProfile?.experience_level || ''
  const availability = freelancerProfile?.availability || ''
  const location = freelancerProfile?.location || ''
  const hourlyRate = freelancerProfile?.hourlyRate || freelancerProfile?.hourly_rate || ''

  const isOwnProposal = address?.toLowerCase() === proposal.freelancerAddress?.toLowerCase()

  return (
    <div
      className="glass-card"
      style={{
        padding: 20,
        borderLeft: `3px solid ${isHovered ? 'var(--quai-green)' : 'var(--border-default)'}`,
        transition: 'border-color var(--transition-base)',
        cursor: 'pointer',
        opacity: isOwnProposal ? 0.7 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header row: avatar + name + bid */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            {avatar
              ? <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <User size={20} color="var(--quai-green)" />
            }
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div>
            {title && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{title}</div>}
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>
              {proposal.freelancerAddress?.slice(0, 6)}...{proposal.freelancerAddress?.slice(-4)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--quai-green)' }}>
            {proposal.rate} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>QUAI</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{timeAgo(proposal.submittedAt)}</div>
        </div>
      </div>

      {/* Tags row */}
      {(experience || availability || location) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {experience && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', padding: '3px 8px' }}>
              <Star size={10} /> {experience}
            </span>
          )}
          {availability && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', padding: '3px 8px' }}>
              <Briefcase size={10} /> {availability}
            </span>
          )}
          {location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)', padding: '3px 8px' }}>
              <MapPin size={10} /> {location}
            </span>
          )}
          {hourlyRate && (
            <span style={{ fontSize: 11, color: 'var(--quai-green)', background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-pill)', padding: '3px 8px', fontFamily: 'var(--font-mono)' }}>
              {hourlyRate} QUAI/hr
            </span>
          )}
        </div>
      )}

      {/* Cover letter (always visible, truncated) */}
      <div
        style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7,
          marginBottom: 12,
          ...(expanded ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' })
        }}
      >
        {proposal.coverLetter || 'No cover letter provided.'}
      </div>
      {proposal.coverLetter?.length > 200 && (
        <button onClick={() => setExpanded(x => !x)} style={{ background: 'none', border: 'none', color: 'var(--quai-green)', fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 10 }}>
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {skills.slice(0, 8).map((s: string) => (
            <span key={s} style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--quai-green)', background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-pill)', padding: '2px 8px' }}>{s}</span>
          ))}
          {skills.length > 8 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{skills.length - 8} more</span>}
        </div>
      )}

      {/* Bio (if expanded) */}
      {expanded && bio && (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14, padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--quai-green-dim)' }}>
          {bio}
        </div>
      )}

      {/* Links */}
      {(github || linkedin || portfolio || resume) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Github size={13} /> GitHub <ExternalLink size={10} />
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Linkedin size={13} /> LinkedIn <ExternalLink size={10} />
            </a>
          )}
          {portfolio && (
            <a href={portfolio} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <Globe size={13} /> Portfolio <ExternalLink size={10} />
            </a>
          )}
          {resume && (
            <a href={resume} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)', textDecoration: 'none', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <FileText size={13} /> Resume / CV <ExternalLink size={10} />
            </a>
          )}
        </div>
      )}

      {/* Action row at bottom */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onAccept}
          className="btn-primary"
          disabled={isOwnProposal}
          style={{
            gap: 6,
            display: 'flex',
            alignItems: 'center',
            padding: '8px 20px',
            background: isOwnProposal ? 'var(--bg-elevated)' : undefined,
            color: isOwnProposal ? 'var(--text-muted)' : undefined,
            borderColor: isOwnProposal ? 'var(--border-default)' : undefined,
            cursor: isOwnProposal ? 'not-allowed' : 'pointer',
            opacity: isOwnProposal ? 0.6 : 1
          }}
        >
          {isOwnProposal ? 'Your Proposal' : 'Accept Proposal'} <Check size={14} />
        </button>
        {isOwnProposal && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>You cannot hire yourself</span>}
      </div>
    </div>
  )
}
