import { motion } from 'framer-motion'

const stats = [
    { value: '$0.001', label: 'Escrow Fee', sub: 'vs $25+ on Upwork' },
    { value: '<3s', label: 'Settlement', sub: 'instant on-chain' },
    { value: '100%', label: 'Non-custodial', sub: 'your keys, your funds' },
    { value: 'NFT', label: 'Every Contract', sub: 'verifiable on-chain' },
]

export default function StatsBar() {
    return (
        <section style={{ padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Glass stats strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="glass-card"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Top accent line */}
                    <div style={{
                        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                        background: 'linear-gradient(to right, transparent, var(--quai-green-dim), transparent)',
                    }} />

                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            style={{
                                padding: '36px 24px',
                                textAlign: 'center',
                                borderRight: i < stats.length - 1 ? '1px solid var(--glass-border)' : 'none',
                                position: 'relative',
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                            >
                                <div style={{
                                    fontSize: 30,
                                    fontWeight: 800,
                                    letterSpacing: '-0.04em',
                                    color: 'var(--quai-green)',
                                    fontFamily: 'var(--font-mono)',
                                    marginBottom: 4,
                                    lineHeight: 1,
                                }}>{s.value}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.sub}</div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
