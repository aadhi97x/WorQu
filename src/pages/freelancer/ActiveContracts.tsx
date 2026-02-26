import { useEffect, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { useProposals, Proposal } from '@/hooks/useProposals'
import { QuaiAmount } from '@/components/shared/QuaiAmount'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate, shortenAddress, formatQuai } from '@/lib/quai'
import { motion } from 'framer-motion'
import { Briefcase, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ActiveContracts() {
    const { address, isConnected, connect } = useWallet()
    const { getByWallet } = useProposals()
    const { getWalletNFTs, markDelivered } = useContracts()
    const [contracts, setContracts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        if (!isConnected || !address) { setLoading(false); return }

        const addr = address.toLowerCase()
        console.log("Fetching contracts for:", addr)

        Promise.all([
            getByWallet(addr),
            getWalletNFTs(addr)
        ]).then(([allProposals, allNFTs]) => {
            console.log("Proposals found:", allProposals.length, allProposals)
            console.log("NFTs found:", allNFTs.length, allNFTs)

            if (mounted) {
                // 1. Proposals that are 'accepted'
                const proposalJobs = allProposals
                    .filter((p: Proposal) => p.status === 'accepted')
                    .map((p: Proposal) => ({
                        id: Number(p.jobId),
                        title: p.jobDetails?.title || `Job #${p.jobId}`,
                        description: p.jobDetails?.description || 'No description available.',
                        budget: p.rate, // use string rate directly
                        client_address: p.jobDetails?.client || p.jobDetails?.client_address,
                        status: p.jobDetails?.status || 'in_progress',
                        type: 'proposal',
                        freelancer: p.freelancerAddress,
                        deadline: p.jobDetails?.deadline
                    }))

                // 2. Minted NFTs
                const nftJobs = allNFTs.map(n => ({
                    id: Number(n.jobId),
                    tokenId: n.tokenId,
                    title: n.jobTitle || `Contract #${n.jobId}`,
                    description: n.jobDescription || 'Active agreement',
                    budget: n.amount, // Keep as Wei string
                    client_address: n.client,
                    status: n.status, // Use on-chain status
                    type: 'nft',
                    freelancer: n.freelancer,
                    deadline: null
                }))

                // 3. Merge: prefer NFT details if both exist for same jobId
                const nftJobIds = new Set(nftJobs.map(n => n.id))
                const combined = [
                    ...proposalJobs.filter(p => !nftJobIds.has(p.id)),
                    ...nftJobs
                ]

                console.log("Combined contracts:", combined.length, combined)
                setContracts(combined)
                setLoading(false)
            }
        }).catch(err => {
            console.error("Failed to fetch active contracts:", err)
            if (mounted) setLoading(false)
        })
        return () => { mounted = false }
    }, [isConnected, address, getByWallet, getWalletNFTs])

    if (!isConnected) {
        return (
            <div style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                    Active Contracts
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                    Connect your wallet to view your active contracts.
                </p>
                <button className="btn-primary" onClick={connect} style={{ padding: '12px 28px' }}>
                    Connect Wallet →
                </button>
            </div>
        )
    }

    const steps = ['Funded', 'In Progress', 'Awaiting Payment']

    const handleMarkDelivered = async (jobId: number) => {
        if (!window.confirm("Are you sure you want to mark this work as delivered? This will notify the client and they will be prompted to release payment.")) return
        try {
            await markDelivered(jobId)
            // Local state update for immediate feedback
            setContracts(prev => prev.map(c => c.id === jobId ? { ...c, status: 'review_pending' } : c))
        } catch (e) {
            console.error('Failed to mark delivered:', e)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '48px 40px', maxWidth: 1200, margin: '0 auto' }}
        >
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Active Contracts</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Manage your in-progress work agreements.
                </p>
            </div>

            {loading ? (
                [1, 2].map(i => <div key={i} className="card skeleton" style={{ height: 200, marginBottom: 16 }} />)
            ) : contracts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><Briefcase size={32} /></div>
                    <div className="empty-state-title">No active contracts</div>
                    <div className="empty-state-text">
                        Submit proposals on jobs to get hired and start earning.
                    </div>
                    <a href="/freelancer/jobs" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                        Find Jobs →
                    </a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {contracts.map(job => {
                        const activeStep = job.status === 'in_progress' || job.status === 'active' ? 1 :
                            job.status === 'review_pending' ? 2 :
                                job.status === 'completed' ? 3 : 1
                        return (
                            <div key={job.id.toString()} className="glass-card" style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                                            {job.title}
                                            {job.type === 'nft' && <span style={{ marginLeft: 8, fontSize: 10, padding: '2px 6px', background: 'var(--quai-green-10)', color: 'var(--quai-green)', borderRadius: 4, verticalAlign: 'middle' }}>MINTED NFT</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <StatusBadge status={job.status === 'active' ? 'in_progress' : job.status} />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                                                {job.type === 'nft' ? `Token ID: #${job.tokenId}` : `Client: ${shortenAddress(job.client_address)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <QuaiAmount amount={job.budget} size="lg" />
                                </div>

                                {/* Description */}
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {job.description}
                                </div>

                                {/* Milestone stepper */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '20px 0' }}>
                                    {steps.map((step, idx) => {
                                        const done = idx < activeStep
                                        const active = idx === activeStep
                                        return (
                                            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: idx < steps.length - 1 ? 1 : 'none' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%',
                                                        background: done || active ? 'var(--quai-green-10)' : 'var(--bg-elevated)',
                                                        border: `2px solid ${done || active ? 'var(--quai-green)' : 'var(--border-default)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: active ? 'var(--glow-green-sm)' : 'none',
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        {done ? (
                                                            <span style={{ color: 'var(--quai-green)', fontSize: 12 }}>✓</span>
                                                        ) : (
                                                            <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--quai-green)' : 'var(--text-muted)' }}>
                                                                {idx + 1}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span style={{ fontSize: 10, color: active ? 'var(--quai-green)' : 'var(--text-muted)', marginTop: 6, whiteSpace: 'nowrap' }}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {idx < steps.length - 1 && (
                                                    <div style={{
                                                        flex: 1, height: 2, marginBottom: 16,
                                                        background: done ? 'var(--quai-green)' : 'var(--border-subtle)',
                                                        transition: 'background 0.3s ease'
                                                    }} />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    {job.status === 'in_progress' && (
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '10px 24px', fontSize: 13, background: 'var(--quai-green)', display: 'flex', alignItems: 'center', gap: 6 }}
                                            onClick={() => handleMarkDelivered(job.id)}
                                        >
                                            <Briefcase size={14} />
                                            Submit Work & Notify Client
                                        </button>
                                    )}
                                    {job.status === 'review_pending' && (
                                        <div style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 13, color: 'var(--quai-green)', fontWeight: 600 }}>
                                                ✓ Work Submitted - Awaiting Review
                                            </span>
                                        </div>
                                    )}
                                    <Link
                                        to={`/freelancer/messages/${job.id}?client=${encodeURIComponent(job.client_address || job.client || 'Client')}`}
                                        className="btn-secondary"
                                        style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                                    >
                                        <MessageCircle size={14} />
                                        Chat with Client
                                    </Link>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
                                        Deadline: {job.deadline ? formatDate(Number(job.deadline)) : 'No deadline set'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </motion.div>
    )
}
