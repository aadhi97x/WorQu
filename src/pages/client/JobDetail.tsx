import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals } from '@/hooks/useProposals'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { QuaiAmount } from '@/components/shared/QuaiAmount'
import { EnergyPanel } from '@/components/shared/EnergyPanel'
import { ProposalCard } from '@/components/client/ProposalCard'
import { Modal } from '@/components/shared/Modal'
import { timeAgo, shortenAddress, formatDate, EXPLORER_URL } from '@/lib/quai'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export function ClientJobDetail() {
  const { id } = useParams()
  const { address, isConnected } = useWallet()
  const { getJob, acceptProposal, releasePayment, raiseDispute } = useContracts()
  const { getByJob } = useProposals()

  const [job, setJob] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)

  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isReleasing, setIsReleasing] = useState(false)

  const fetchJob = async () => {
    if (!id || !isConnected) return
    try {
      const j = await getJob(Number(id))
      const p = await getByJob(Number(id))
      setJob(j)
      setProposals(p)
    } catch (e) {
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    if (mounted) fetchJob()
    return () => { mounted = false }
  }, [id, isConnected])

  const handleAccept = async () => {
    if (!selectedProposal) return
    setIsAccepting(true)
    console.log("Starting handleAccept:", { job, selectedProposal, currentAddress: address })
    try {
      const fAddr = selectedProposal.freelancerAddress || selectedProposal.freelancer_address
      if (!fAddr) throw new Error("Freelancer address missing in proposal")

      // Logic Check: is current user the client?
      if (job.client.toLowerCase() !== address?.toLowerCase()) {
        throw new Error(`Only the job client (${shortenAddress(job.client)}) can accept proposals. You are connected as ${shortenAddress(address || '')}.`)
      }

      if (fAddr.toLowerCase() === address?.toLowerCase()) {
        throw new Error("You cannot hire yourself. Contract rules forbid it.")
      }

      const tokenURI = `ipfs://mock-uri-${job.id}`
      console.log("Calling acceptProposal hook with:", { jobId: job.id, fAddr, tokenURI })

      const receipt = await acceptProposal(Number(job.id), fAddr, tokenURI)
      console.log("Accept proposal success receipt:", receipt)

      toast.success('Proposal accepted!')
      setMintedTokenId(Math.floor(Math.random() * 1000)) // Mock token ID for demo
      fetchJob()
    } catch (e: any) {
      console.error('Accept proposal error details:', e)
      const msg = e.reason || e.message || (typeof e === 'string' ? e : 'Unknown error')
      toast.error(`Error: ${msg}`)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleRelease = async () => {
    setShowRatingModal(true)
  }

  const submitRatingAndRelease = async () => {
    setIsReleasing(true)
    try {
      await releasePayment(Number(job.id), rating, comment)
      toast.success('Payment released and rating saved!')
      setShowRatingModal(false)
      fetchJob()
    } catch (e) {
      toast.error('Failed to release payment')
    } finally {
      setIsReleasing(false)
    }
  }

  const handleDispute = async () => {
    try {
      await raiseDispute(Number(job.id))
      toast.success('Dispute raised')
      fetchJob()
    } catch (e) {
      toast.error('Failed to raise dispute')
    }
  }

  if (loading) return <div style={{ padding: '80px 40px', maxWidth: 1500, margin: '0 auto' }}><div className="card skeleton" style={{ height: 400 }} /></div>
  if (!job) return <div style={{ padding: '80px 24px', textAlign: 'center' }}>Job not found</div>

  const status = job.status || 'open'
  const acceptedProp = proposals.find(p => p.status === 'accepted')
  const freelancerAddress = acceptedProp?.freelancerAddress || acceptedProp?.freelancer_address

  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: 1500, margin: '0 auto' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        <Link to="/client/my-jobs" style={{ color: 'inherit', textDecoration: 'none' }}>My Jobs</Link> &nbsp;&gt;&nbsp; {job.title}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        {/* Left Column */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{job.title}</h1>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <StatusBadge status={status === 'in_progress' ? 'active' : status} />
            <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
              {job.category || 'Development'}
            </span>
            <span style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '3px 10px', fontSize: 11, color: 'var(--text-secondary)' }}>
              Intermediate
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Posted {timeAgo(Number(job.createdAt || new Date(job.created_at).getTime()))}</span>
          </div>

          <div className="job-description" style={{ marginBottom: 24 }}>
            <ReactMarkdown>{job.description}</ReactMarkdown>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
            {['React', 'Solidity', 'Web3'].map(skill => (
              <span key={skill} style={{ background: 'var(--quai-green-dim)', color: 'var(--quai-green)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: 12 }}>
                {skill}
              </span>
            ))}
          </div>

          {(status === 'open' || status === 'funded') && (
            <div>
              <h2 className="section-label" style={{ marginBottom: 16 }}>PROPOSALS ({proposals.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {proposals.length === 0 ? (
                  <div className="glass-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No proposals yet. Check back later.
                  </div>
                ) : (
                  proposals.map((p, i) => (
                    <ProposalCard
                      key={p.id || i}
                      proposal={p}
                      onAccept={() => setSelectedProposal(p)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {(status === 'in_progress' || status === 'active' || status === 'completed' || status === 'review_pending') && (
            <div className="glass-card" style={{ borderLeft: '3px solid var(--quai-green)', padding: 24 }}>
              <div className="section-label" style={{ color: 'var(--quai-green)', marginBottom: 16 }}>
                {status === 'completed' ? '✅ CONTRACT COMPLETED' :
                  status === 'review_pending' ? '🔔 WORK DELIVERED - NEEDS REVIEW' :
                    '⚡ CONTRACT ACTIVE'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Work Agreement NFT</div>
                  <a href={`${EXPLORER_URL}/token/${job.id}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    #{job.id} <ExternalLink size={12} />
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Freelancer Address</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>{freelancerAddress ? shortenAddress(freelancerAddress) : 'Unknown'}</span>
                    {freelancerAddress && (
                      <Link to={`/client/profile/${freelancerAddress}`} style={{ fontSize: 11, color: 'var(--quai-green)', textDecoration: 'none' }}>View Profile</Link>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Amount</div>
                  <QuaiAmount amount={BigInt(job.budget * 1e18)} size="sm" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Deadline</div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{formatDate(Number(job.deadline))}</div>
                </div>
              </div>

              {(status === 'in_progress' || status === 'active' || status === 'review_pending') && (
                <>
                  <hr className="divider" />
                  {status === 'review_pending' ? (
                    <div style={{ background: 'var(--quai-green-05)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--quai-green)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        <CheckCircle size={18} />
                        Freelancer has marked work as delivered
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        Please review the work and release the payment if satisfied.
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                      The work is in progress. Release payment once you're satisfied with the delivery.
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-primary" onClick={handleRelease} style={{ padding: '12px 24px' }}>
                      ✓ {status === 'review_pending' ? 'Approve & Release Payment' : 'Release Payment early'}
                    </button>
                    <button className="btn-danger" onClick={handleDispute}>
                      ⚠ Raise Dispute
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
          <EnergyPanel />
        </div>
      </div>

      {mintedTokenId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', damping: 20 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--quai-green-dim)', boxShadow: '0 0 80px var(--quai-green-10)', padding: 40, borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: 440, width: '100%', margin: 24 }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
              <CheckCircle size={64} color="var(--quai-green)" style={{ margin: '0 auto 24px' }} />
            </motion.div>
            <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Work Agreement NFT Minted!
            </motion.h3>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--quai-green)', marginBottom: 24 }}>
              Token ID: #{mintedTokenId}
            </motion.div>
            <motion.a
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              href={`${EXPLORER_URL}/token/${mintedTokenId}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 32 }}
            >
              View NFT on Quaiscan <ExternalLink size={12} />
            </motion.a>
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="btn-primary" style={{ width: '100%', padding: '16px' }} onClick={() => { setSelectedProposal(null); setMintedTokenId(null); fetchJob(); }}>
              Continue →
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ padding: 40, width: 440 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Rate Freelancer</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Payment for <strong>{job.title}</strong> will be released. How was your experience?
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: s <= rating ? '#fbbf24' : 'var(--text-muted)' }}
                >
                  <CheckCircle size={32} style={{ fill: s <= rating ? '#fbbf24' : 'none', color: s <= rating ? '#fbbf24' : 'var(--text-muted)' }} />
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
                onClick={() => setShowRatingModal(false)}
                disabled={isReleasing}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={submitRatingAndRelease}
                disabled={isReleasing}
                style={{ flex: 2 }}
              >
                {isReleasing ? 'Processing...' : 'Complete & Release'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {selectedProposal && !mintedTokenId && (
        <Modal isOpen={!!selectedProposal} onClose={() => { if (!isAccepting) setSelectedProposal(null) }} title="Accept this Proposal?">
          <div>
            <div style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>
                {selectedProposal.freelancer_address}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Budget:</span>
                <QuaiAmount amount={BigInt((selectedProposal.rate || 0) * 1e18)} size="sm" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                'A Work Agreement NFT will be minted to both wallets',
                'Funds remain locked until you manually release them',
                'This action is permanently recorded on Quai Network'
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="var(--quai-green)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setSelectedProposal(null)} disabled={isAccepting}>Cancel</button>
              <button className={`btn-primary ${isAccepting ? 'btn-loading' : ''}`} onClick={handleAccept} disabled={isAccepting}>
                {isAccepting ? 'Accepting...' : 'Accept & Mint NFT →'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
