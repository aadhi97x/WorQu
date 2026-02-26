import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import ShootingStars from './ShootingStars'

export default function CTASection({ onClientClick, onFreelancerClick }) {
    return (
        <section id="cta" style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>

            <ShootingStars starColor="#4EFFA0" trailColor="#2EE8FF" minSpeed={14} maxSpeed={30} minDelay={1500} maxDelay={4000} />
            <ShootingStars starColor="#2dd87a" trailColor="#4EFFA0" minSpeed={10} maxSpeed={22} minDelay={3000} maxDelay={6000} />

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700, height: 500, pointerEvents: 'none',
                background: 'radial-gradient(ellipse, rgba(78,255,160,0.07) 0%, transparent 65%)',
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Big CTA card */}
                    <div style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-2xl)',
                        backdropFilter: 'blur(24px)',
                        padding: 'clamp(48px, 6vw, 80px)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 0 80px rgba(78,255,160,0.04), var(--shadow-glass)',
                    }}>
                        {/* Top line */}
                        <div style={{
                            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                            background: 'linear-gradient(to right, transparent, var(--quai-green-dim), transparent)',
                        }} />

                        {/* Corner orbs */}
                        <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,255,160,0.06), transparent 70%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(78,255,160,0.04), transparent 70%)', pointerEvents: 'none' }} />

                        {/* Label */}
                        <div style={{ marginBottom: 28 }}>
                            <span className="overline-chip"><Zap size={10} /> Beta Launch — Free to Join</span>
                        </div>

                        {/* Headline */}
                        <h2 style={{
                            fontSize: 'clamp(34px, 5vw, 60px)',
                            fontWeight: 800,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.05,
                            marginBottom: 20,
                        }}>
                            Ready to work without<br />
                            <span className="gradient-text">middlemen?</span>
                        </h2>

                        <p style={{
                            fontSize: 16,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.75,
                            maxWidth: 480,
                            margin: '0 auto 44px',
                        }}>
                            Join QuaiWork and start hiring or freelancing on the only platform where payments are trustless, instant, and costs fractions of a cent.
                        </p>

                        {/* CTAs */}
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
                            <button onClick={onClientClick} className="btn-primary" style={{ fontSize: 14, padding: '14px 36px', border: 'none' }}>
                                Join as Client <ArrowRight size={15} />
                            </button>
                            <button onClick={onFreelancerClick} className="btn-secondary" style={{ fontSize: 14, padding: '14px 36px', border: 'none' }}>
                                Join as Freelancer
                            </button>
                        </div>

                        {/* Trust line */}
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                            No credit card • Non-custodial • Open source
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
