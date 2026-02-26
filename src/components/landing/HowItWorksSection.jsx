import { motion } from 'framer-motion'
import SpotlightCard from './SpotlightCard'

const steps = [
    {
        num: '01',
        title: 'Post a Job',
        desc: 'Describe your project, set your budget, and publish — instantly visible to talent worldwide.',
    },
    {
        num: '02',
        title: 'Fund Escrow',
        desc: 'Lock payment in a smart contract. Freelancers see it\'s real. You know it\'s safe.',
    },
    {
        num: '03',
        title: 'Work Done',
        desc: 'Freelancer delivers. You review. One click releases funds directly to their wallet.',
    },
    {
        num: '04',
        title: 'NFT Receipt',
        desc: 'A verified NFT is minted for both parties — immutable proof of a completed contract.',
    },
]

export default function HowItWorksSection() {
    return (
        <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>

            {/* Ambient center glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800, height: 600, pointerEvents: 'none',
                background: 'radial-gradient(ellipse, rgba(78,255,160,0.04) 0%, transparent 65%)',
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ marginBottom: 72, maxWidth: 480 }}
                >
                    <span className="section-label">How it works</span>
                    <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
                        Four steps.<br />
                        <span className="gradient-text">Zero friction.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                        No lengthy onboarding. No middlemen. Just work and payment — on-chain.
                    </p>
                </motion.div>

                {/* Steps — horizontal */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 16,
                    position: 'relative',
                }}>
                    {/* Connector line */}
                    <div style={{
                        position: 'absolute',
                        top: 36, left: '12.5%', right: '12.5%', height: 1,
                        background: 'linear-gradient(to right, transparent, var(--glass-border) 20%, var(--glass-border) 80%, transparent)',
                        zIndex: 0,
                    }} />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <SpotlightCard style={{
                                background: 'var(--glass-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-xl)',
                                backdropFilter: 'blur(20px)',
                                padding: '28px 24px 28px',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {/* Step number orb */}
                                <div style={{
                                    width: 44, height: 44,
                                    background: 'var(--quai-green-10)',
                                    border: '1px solid var(--quai-green-dim)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 12, fontWeight: 700,
                                    color: 'var(--quai-green)',
                                    marginBottom: 24,
                                    flexShrink: 0,
                                    position: 'relative', zIndex: 1,
                                }}>
                                    {step.num}
                                </div>

                                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>
                                    {step.title}
                                </h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                                    {step.desc}
                                </p>

                                {/* Active indicator line removed based on user feedback */}
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
