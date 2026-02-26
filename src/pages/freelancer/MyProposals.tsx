import { useState, useEffect } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { useProposals, Proposal } from '@/hooks/useProposals'
import { formatQuai, timeAgo } from '@/lib/quai'
import { motion } from 'framer-motion'
import { FileText, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function MyProposals() {
    const { address, isConnected, connect } = useWallet()
    const { getByWallet, withdraw } = useProposals()

    const [myProposals, setMyProposals] = useState<Proposal[]>([])
    const [loading, setLoading] = useState(true) // Start as true to avoid initial empty state flicker
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (jobId: number, id: string | undefined) => {
        if (!address) return
        if (!confirm('Are you sure you want to withdraw this proposal?')) return

        setDeletingId(id || String(jobId))
        try {
            await withdraw(jobId, address)
            setMyProposals(prev => prev.filter(p => p.jobId !== jobId))
            toast.success('Proposal withdrawn')
        } catch (e: any) {
            toast.error('Failed to withdraw: ' + e.message)
        } finally {
            setDeletingId(null)
        }
    }

    useEffect(() => {
        let mounted = true
        if (address) {
            // Only show loader if we don't have data yet
            if (myProposals.length === 0) setLoading(true)

            getByWallet(address).then(data => {
                if (mounted) {
                    setMyProposals(data)
                    setLoading(false)
                }
            })
        }
        return () => { mounted = false }
    }, [address, getByWallet])

    if (!isConnected) {
        return (
            <div style={{ padding: '80px 24px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                    My Proposals
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                    Connect your wallet to view your submitted proposals.
                </p>
                <button className="btn-primary" onClick={connect} style={{ padding: '12px 28px' }}>
                    Connect Wallet →
                </button>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '48px 40px', maxWidth: 1200, margin: '0 auto' }}
        >
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>My Proposals</h1>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Track proposals you've submitted to clients.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--quai-green)' }}>
                    <Loader2 className="animate-spin" size={32} />
                </div>
            ) : myProposals.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon"><FileText size={32} /></div>
                    <div className="empty-state-title">No proposals yet</div>
                    <div className="empty-state-text">
                        Browse open jobs and submit a proposal to get started.
                    </div>
                    <a href="/freelancer/jobs" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px' }}>
                        Find Jobs →
                    </a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {myProposals.map((p, i) => (
                        <div key={p.id || i} className="glass-card" style={{ padding: '20px 24px', borderLeft: '3px solid var(--border-default)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                        {p.jobDetails?.title || `Job #${p.jobId}`}
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                        {p.coverLetter?.slice(0, 120)}...
                                    </div>
                                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <div style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-elevated)', color: p.status === 'accepted' ? 'var(--quai-green)' : 'var(--text-muted)' }}>
                                            {(p.status || 'pending').toUpperCase()}
                                        </div>
                                        {p.jobDetails?.category && (
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                                {p.jobDetails.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--quai-green)' }}>
                                            {formatQuai(p.rate)} QUAI
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                            {timeAgo(p.submittedAt || 0)}
                                        </div>
                                    </div>

                                    {p.status === 'pending' && (
                                        <button
                                            onClick={() => handleDelete(p.jobId, p.id)}
                                            disabled={deletingId === (p.id || String(p.jobId))}
                                            style={{
                                                background: 'none', border: '1px solid var(--border-default)',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                                                padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                                                opacity: deletingId === (p.id || String(p.jobId)) ? 0.7 : 1,
                                                transition: 'all 0.2s', marginTop: 'auto'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)' }}
                                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'none' }}
                                        >
                                            {deletingId === (p.id || String(p.jobId)) ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            Withdraw
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}
