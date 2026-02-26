import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Send, User } from 'lucide-react'
import { useState } from 'react'

export function Messages() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const clientName = searchParams.get('client') || 'Client'
    const [msg, setMsg] = useState('')

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                height: 'calc(100vh - 120px)',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 1000,
                margin: '0 auto',
                padding: '24px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{clientName}</h2>
                    <span style={{ fontSize: 12, color: 'var(--quai-green)' }}>Online</span>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ alignSelf: 'center', background: 'var(--bg-elevated)', padding: '4px 12px', borderRadius: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    Job ID: {id} • March 26, 2026
                </div>

                <div style={{ alignSelf: 'flex-start', maxWidth: '70%', background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: '4px 16px 16px 16px', fontSize: 14 }}>
                    Hello! Thanks for starting the work. Let me know if you have any questions about the technical specs.
                </div>

                <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--quai-green-10)', border: '1px solid var(--quai-green)', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', fontSize: 14 }}>
                    I've started on the core logic and should have a first milestone ready by tomorrow evening.
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', marginTop: 16 }}>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14 }}
                />
                <button disabled style={{ opacity: 0.5, cursor: 'not-allowed', background: 'transparent', border: 'none', color: 'var(--quai-green)' }}>
                    <Send size={20} />
                </button>
            </div>
        </motion.div>
    )
}
