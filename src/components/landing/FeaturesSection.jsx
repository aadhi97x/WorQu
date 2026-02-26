import { motion } from 'framer-motion'
import { Zap, Shield, Code2, Globe, Layers, ArrowUpRight } from 'lucide-react'
import SpotlightCard from './SpotlightCard'
import AnimatedGridPattern from './AnimatedGridPattern'

const features = [
    {
        icon: <Zap size={20} />,
        title: 'Instant Payments',
        desc: 'Smart contracts release funds the moment work is approved. Zero delays, zero chargebacks, zero banks.',
        tag: '< 3s settlement',
        size: 'large',
    },
    {
        icon: <Shield size={20} />,
        title: 'On-chain Escrow',
        desc: 'Funds are locked in a contract — visible to both parties, released only on approval.',
        tag: '$0.001 fee',
        size: 'small',
    },
    {
        icon: <Code2 size={20} />,
        title: 'NFT Contracts',
        desc: 'Every agreement is minted as an NFT. Build a verifiable on-chain reputation automatically.',
        tag: 'EIP-721',
        size: 'small',
    },
    {
        icon: <Globe size={20} />,
        title: 'Global & Permissionless',
        desc: 'Hire or work from anywhere. No KYC, no restrictions, no platform approval required.',
        tag: '190+ countries',
        size: 'small',
    },
    {
        icon: <Layers size={20} />,
        title: 'Multi-chain Ready',
        desc: 'Built on Quai Network\'s sharded architecture — scales to millions of transactions without congestion.',
        tag: 'Quai Sharding',
        size: 'large',
    },
]

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }
    }),
}

export default function FeaturesSection() {
    return (
        <section id="features" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>

            {/* Subtle animated grid BG */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}>
                <AnimatedGridPattern cellSize={48} numSquares={18} />
            </div>

            {/* Radial fade mask */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, var(--bg-base) 100%)',
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ marginBottom: 64, maxWidth: 540 }}
                >
                    <span className="section-label">Features</span>
                    <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                        Built different.<br />
                        <span className="gradient-text">Designed for work.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                        Everything you need to hire globally and get paid instantly — without middlemen or broken promises.
                    </p>
                </motion.div>

                {/* Bento grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'auto auto',
                    gap: 16,
                }}>
                    {features.map((f, i) => {
                        const isLarge = f.size === 'large'
                        return (
                            <motion.div
                                key={f.title}
                                custom={i}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-40px' }}
                                variants={fadeUp}
                                style={{ gridColumn: isLarge ? 'span 2' : 'span 1' }}
                            >
                                <SpotlightCard style={{
                                    height: '100%',
                                    borderRadius: 'var(--radius-xl)',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    backdropFilter: 'blur(20px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: isLarge ? '40px' : '32px',
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>

                                    {/* Removed shimmer line based on user feedback */}

                                    {/* Corner ambient */}
                                    <div style={{
                                        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                                        background: 'radial-gradient(circle, rgba(78,255,160,0.04), transparent 70%)',
                                        pointerEvents: 'none',
                                    }} />

                                    {/* Icon */}
                                    <div style={{
                                        width: 44, height: 44,
                                        background: 'var(--quai-green-10)',
                                        border: '1px solid var(--quai-green-dim)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--quai-green)',
                                        marginBottom: 24,
                                        flexShrink: 0,
                                    }}>
                                        {f.icon}
                                    </div>

                                    <h3 style={{ fontSize: isLarge ? 20 : 16, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
                                        {f.title}
                                    </h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, flex: 1, marginBottom: 20 }}>
                                        {f.desc}
                                    </p>

                                    {/* Footer row */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)', fontSize: 10,
                                            color: 'var(--quai-green)', background: 'var(--quai-green-10)',
                                            border: '1px solid var(--quai-green-dim)',
                                            borderRadius: 'var(--radius-pill)', padding: '3px 10px',
                                        }}>{f.tag}</span>
                                        <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
