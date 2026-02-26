import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Copy, ExternalLink, Github, Linkedin, ShieldCheck, Star } from 'lucide-react'
import { useContracts } from '@/hooks/useContracts'
import { NFTCard } from '@/components/shared/NFTCard'
import { shortenAddress, EXPLORER_URL } from '@/lib/quai'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

function AnimatedStat({ value, decimals = 0 }: { value: number, decimals?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (value === 0) {
      setCount(0)
      return
    }
    let start = 0
    const duration = 1000
    const increment = value / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        clearInterval(timer)
        setCount(value)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])
  return <>{decimals ? count.toFixed(decimals) : Math.ceil(count)}</>
}

export function FreelancerProfile() {
  const { address } = useParams()
  const { getWalletNFTs, getFreelancerRating } = useContracts()
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0, reviews: [] as any[] })

  useEffect(() => {
    if (address) {
      getFreelancerRating(address).then(setRatingInfo)
      getWalletNFTs(address).then(data => {
        setNfts(data)
        setLoading(false)
      })
      supabase.from('profiles').select('*').eq('wallet_address', address.toLowerCase()).maybeSingle().then(({ data }) => {
        if (data) setProfile(data)
      })
    }
  }, [address, getFreelancerRating, getWalletNFTs])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (!address) return null

  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 48 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--quai-green)',
          background: `linear-gradient(135deg, #4EFFA0, #4E9FFF)`, flexShrink: 0
        }} />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-primary)' }}>{address}</span>
            <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Copy size={14} />
            </button>
            <a href={`${EXPLORER_URL}/address/${address}`} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
              <ExternalLink size={14} />
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--quai-green)' }} />
              Cyprus-1
            </span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Member since April 2025</span>
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}><AnimatedStat value={nfts.length} /></span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>jobs completed</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                {ratingInfo.count > 0 ? ratingInfo.average.toFixed(1) : '—'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Star size={10} style={{ display: 'inline', verticalAlign: '-1px' }} /> rating ({ratingInfo.count})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}><AnimatedStat value={0} decimals={4} /></span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>QUAI earned</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}><AnimatedStat value={100} />%</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>release rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Verified Profile */}
      {profile && (profile.is_analyzed || profile.github_url || profile.linkedin_url) && (
        <div className="glass-card" style={{ padding: 24, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <h2 className="section-label" style={{ margin: 0 }}>AI-VERIFIED EXPERTISE</h2>
            {profile.is_analyzed && <ShieldCheck size={16} color="var(--quai-green)" />}
          </div>

          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Connected Accounts:</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}>
                    <Github size={16} /> GitHub
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', transition: 'all 0.2s' }}>
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {!profile.github_url && !profile.linkedin_url && (
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No accounts connected.</span>
                )}
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 250 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Extracted Skills:</div>
              {profile.ai_skills && profile.ai_skills.length > 0 ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {profile.ai_skills.map((skill: string) => (
                    <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--quai-green-10)', color: 'var(--quai-green)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-pill)', padding: '6px 14px', fontSize: 13 }}>
                      <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--quai-green)' }} />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No skills analyzed yet.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NFT Portfolio */}
      <div>
        <h2 className="section-label" style={{ marginBottom: 24 }}>COMPLETED WORK (ON-CHAIN)</h2>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {[1, 2, 3].map(i => <div key={i} className="card skeleton" style={{ height: 200 }} />)}
          </div>
        ) : nfts.length === 0 ? (
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No completed work NFTs found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {nfts.map((nft, i) => (
              <NFTCard
                key={i}
                tokenId={nft.tokenId}
                jobTitle={`Job #${nft.jobId}`}
                counterpartyAddress={nft.client}
                amountQuai={nft.amount.toString()}
                status={nft.status}
                completedAt={Number(nft.createdAt)}
                quaiscanUrl={`${EXPLORER_URL}/token/${nft.tokenId}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
