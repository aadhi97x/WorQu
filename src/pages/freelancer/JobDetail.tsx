import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Calendar, Tag, Loader2, Shield, Clock,
    User, Briefcase, CheckCircle2, Send, AlertCircle, Globe
} from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals } from '@/hooks/useProposals'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, shortenAddress, timeAgo } from '@/lib/quai'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const CATEGORY_ICONS: Record<string, string> = {
    'Development': '💻',
    'Design': '🎨',
    'Writing': '✍️',
    'Marketing': '📣',
    'Web3': '🔗',
    'AI / ML': '🤖',
    'DevOps': '⚙️',
    'Data': '📊',
    'default': '📁'
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{icon}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', width: 100, flexShrink: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
        </div>
    )
}

export function FreelancerJobDetail() {
    const { id } = useParams()
    const { address, isConnected } = useWallet()
    const { getJob } = useContracts()
    const { submit, hasSubmitted, getByJob } = useProposals()
    const navigate = useNavigate()

    const [job, setJob] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [alreadyApplied, setAlreadyApplied] = useState(false)
    const [proposalCount, setProposalCount] = useState(0)

    const [rate, setRate] = useState('')
    const [coverLetter, setCoverLetter] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        let mounted = true
        const load = async () => {
            if (!id) return
            try {
                const j = await getJob(Number(id))
                const proposals = await getByJob(Number(id))
                if (mounted) {
                    setJob(j)
                    setProposalCount(proposals.length)
                    if (isConnected && address) {
                        const already = await hasSubmitted(Number(id), address)
                        setAlreadyApplied(already)
                    }
                }
            } catch {
                toast.error('Failed to load job')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [id, isConnected, address])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address || !job) return
        if (!rate || parseFloat(rate) <= 0) { toast.error('Enter a valid rate'); return }
        if (!coverLetter.trim()) { toast.error('Write a cover letter'); return }

        setSubmitting(true)
        try {
            await submit({ jobId: Number(id), freelancerAddress: address, rate, coverLetter })
            setAlreadyApplied(true)
        } catch (e: any) {
            toast.error('Failed: ' + e.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100, gap: 16, color: 'var(--quai-green)' }}>
            <Loader2 className="animate-spin" size={36} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading job details...</span>
        </div>
    )

    if (!job) return (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Job not found</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>This job may have been removed or doesn't exist.</div>
            <Link to="/freelancer/jobs" className="btn-primary" style={{ textDecoration: 'none' }}>Browse All Jobs →</Link>
        </div>
    )

    const categoryIcon = CATEGORY_ICONS[job.category] || CATEGORY_ICONS['default']
    const daysLeft = job.deadline ? Math.max(0, Math.ceil((Number(job.deadline) - Date.now() / 1000) / 86400)) : null
    const urgency = daysLeft !== null && daysLeft <= 3 ? 'critical' : daysLeft !== null && daysLeft <= 7 ? 'soon' : 'normal'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '28px 40px 60px', maxWidth: 1200, margin: '0 auto' }}
        >
            {/* Back breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
                    <ArrowLeft size={14} /> Back
                </button>
                <span style={{ color: 'var(--border-default)' }}>/</span>
                <Link to="/freelancer/jobs" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Jobs</Link>
                <span style={{ color: 'var(--border-default)' }}>/</span>
                <span style={{ color: 'var(--text-secondary)' }}>{job.title}</span>
            </div>

            {/* Urgency banner */}
            {urgency === 'critical' && (
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-md)', padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertCircle size={15} color="#ef4444" />
                    <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 500 }}>⏱ Deadline in {daysLeft} day{daysLeft !== 1 ? 's' : ''} — Apply quickly!</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'flex-start' }}>
                {/* ── Left column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Hero card */}
                    <div className="glass-card" style={{ padding: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                                    background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                                }}>
                                    {categoryIcon}
                                </div>
                                <div>
                                    <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{job.title}</h1>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)', padding: '2px 8px', color: 'var(--text-secondary)' }}>{job.category}</span>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Posted {timeAgo(job.createdAt || 0)}</span>
                                    </div>
                                </div>
                            </div>
                            <StatusBadge status={job.status === 'in_progress' ? 'active' : (job.status || 'open')} />
                        </div>

                        {/* Meta strip */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', marginBottom: 24 }}>
                            {[
                                { icon: <Briefcase size={14} />, text: job.category || 'General' },
                                { icon: <Calendar size={14} />, text: `Due ${formatDate(Number(job.deadline))}`, accent: urgency !== 'normal' },
                                { icon: <User size={14} />, text: shortenAddress(job.client || job.client_address) },
                                { icon: <Send size={14} />, text: `${proposalCount} proposal${proposalCount !== 1 ? 's' : ''}` },
                                { icon: <Globe size={14} />, text: 'Remote' },
                            ].map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: m.accent ? '#f97316' : 'var(--text-secondary)' }}>
                                    <span style={{ color: m.accent ? '#f97316' : 'var(--text-muted)' }}>{m.icon}</span>
                                    {m.text}
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="section-label" style={{ marginBottom: 12 }}>DESCRIPTION</div>
                        <div style={{
                            fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.85,
                            whiteSpace: 'pre-wrap', minHeight: 80
                        }}>
                            {job.description || 'No description provided.'}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label" style={{ marginBottom: 14 }}>REQUIRED SKILLS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(job.skills?.length ? job.skills : ['React', 'Solidity', 'Web3', 'TypeScript']).map((s: string) => (
                                <span key={s} style={{
                                    background: 'var(--quai-green-10)', color: 'var(--quai-green)',
                                    border: '1px solid var(--quai-green-dim)',
                                    borderRadius: 'var(--radius-pill)', padding: '5px 12px',
                                    fontFamily: 'var(--font-mono)', fontSize: 12
                                }}>{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Job details table */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label" style={{ marginBottom: 4 }}>JOB DETAILS</div>
                        <InfoRow icon={<Tag size={14} />} label="Category" value={job.category || '—'} />
                        <InfoRow icon={<Calendar size={14} />} label="Deadline" value={
                            <span style={{ color: urgency === 'critical' ? '#ef4444' : urgency === 'soon' ? '#f97316' : 'var(--text-primary)' }}>
                                {formatDate(Number(job.deadline))} {daysLeft !== null && `(${daysLeft}d left)`}
                            </span>
                        } />
                        <InfoRow icon={<Shield size={14} />} label="Payment" value="Escrow · Released on approval" />
                        <InfoRow icon={<Globe size={14} />} label="Location" value="Remote · Worldwide" />
                        <InfoRow icon={<Clock size={14} />} label="Type" value="Fixed Price Contract" />
                        <InfoRow icon={<User size={14} />} label="Client" value={
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                                {job.client || job.client_address || '—'}
                            </span>
                        } />
                        <InfoRow icon={<CheckCircle2 size={14} />} label="Status" value={
                            <span style={{ textTransform: 'capitalize', color: job.status === 'open' ? 'var(--quai-green)' : 'var(--text-primary)' }}>
                                {job.status || 'open'}
                            </span>
                        } />
                    </div>

                    {/* Tips for a good proposal */}
                    <div style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--quai-green)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            ✨ Tips for a winning proposal
                        </div>
                        <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
                            <li>Show relevant past projects or portfolio links</li>
                            <li>Be specific about your timeline and deliverables</li>
                            <li>Set a competitive rate based on the budget range</li>
                            <li>Address the client's specific needs in the description</li>
                        </ul>
                    </div>
                </div>

                {/* ── Right column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 88 }}>
                    {/* Budget */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <div className="section-label" style={{ marginBottom: 10 }}>BUDGET</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 34, fontWeight: 700, color: 'var(--quai-green)', lineHeight: 1 }}>
                            {job.budget}
                            <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>QUAI</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Shield size={12} color="var(--quai-green)" /> Escrow Protected · Release on your approval
                        </div>
                        <div style={{ marginTop: 16, padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                                <span>Proposals received</span>
                                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{proposalCount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                                <span>Deadline</span>
                                <span style={{ color: urgency === 'critical' ? '#ef4444' : urgency === 'soon' ? '#f97316' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                                    {daysLeft !== null ? `${daysLeft}d left` : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Proposal form / status */}
                    {isConnected ? (
                        address?.toLowerCase() === (job.client || job.client_address)?.toLowerCase() ? (
                            <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>This is your job</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>You cannot submit a proposal to a job you posted.</div>
                            </div>
                        ) : alreadyApplied ? (
                            <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--quai-green-10)', border: '2px solid var(--quai-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <CheckCircle2 size={26} color="var(--quai-green)" />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Proposal Submitted!</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>You've already applied to this job. The client will review proposals soon.</div>
                                <Link to="/freelancer/proposals" className="btn-secondary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>View My Proposals →</Link>
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: 24 }}>
                                <div className="section-label" style={{ marginBottom: 16 }}>SUBMIT PROPOSAL</div>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                                            Your Rate (QUAI)
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={rate}
                                            onChange={e => setRate(e.target.value)}
                                            placeholder={`Max: ${job.budget} QUAI`}
                                            step="0.01"
                                            min="0.01"
                                            required
                                            style={{ fontFamily: 'var(--font-mono)', fontSize: 16 }}
                                        />
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>Client budget: {job.budget} QUAI</div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                                            Cover Letter
                                        </label>
                                        <textarea
                                            className="input"
                                            value={coverLetter}
                                            onChange={e => setCoverLetter(e.target.value)}
                                            placeholder="Introduce yourself, explain your experience, and why you're the best fit for this project..."
                                            style={{ minHeight: 160, resize: 'vertical', fontSize: 13, lineHeight: 1.7 }}
                                            required
                                        />
                                        <div style={{ fontSize: 11, color: coverLetter.length > 1500 ? 'var(--error)' : 'var(--text-muted)', marginTop: 5, textAlign: 'right' }}>
                                            {coverLetter.length} / 1500
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={submitting || coverLetter.length > 1500}
                                        style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0' }}
                                    >
                                        {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Proposal</>}
                                    </button>
                                </form>
                            </div>
                        )
                    ) : (
                        <div className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Connect to Apply</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Connect your Pelagus wallet to submit a proposal for this job.</div>
                            <Link to="/freelancer" className="btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>Connect Wallet →</Link>
                        </div>
                    )}

                    {/* About escrow */}
                    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 18 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Shield size={13} color="var(--quai-green)" /> How escrow works
                        </div>
                        <ol style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7, paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <li>Client funds are locked in a smart contract</li>
                            <li>You complete the work</li>
                            <li>Client reviews and releases payment</li>
                            <li>QUAI is transferred instantly to your wallet</li>
                        </ol>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
