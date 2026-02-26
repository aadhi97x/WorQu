import { motion } from 'framer-motion'
import { ArrowRight, Zap, DollarSign, Clock, Users } from 'lucide-react'
import ShootingStars from './ShootingStars'
import RevealWaveImage from './RevealWaveImage'

const wordVariant = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    show: (i) => ({
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.55, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }
    }),
}

export default function HeroSection({ onClientClick }) {
    const headline = ['Hire talent.', 'Pay instantly.', 'No middlemen.']

    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: 'var(--bg-base)',
        }}>

            {/* ── RevealWaveImage fullscreen BG ── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <RevealWaveImage
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&auto=format&fit=crop&q=80"
                    waveSpeed={0.12}
                    waveFrequency={0.5}
                    waveAmplitude={0.35}
                    revealRadius={0.5}
                    revealSoftness={1}
                    pixelSize={2}
                    mouseRadius={0.4}
                />
            </div>

            {/* ── Gradient overlay lightened ── */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'linear-gradient(120deg, rgba(3,3,3,0.8) 0%, rgba(3,3,3,0.5) 55%, rgba(3,3,3,0.2) 100%)',
            }} />

            {/* ── Corner green ambient ── */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-5%', zIndex: 1, pointerEvents: 'none',
                width: 600, height: 600,
                background: 'radial-gradient(circle, rgba(78,255,160,0.06) 0%, transparent 65%)',
            }} />

            {/* ── Background Branding Logo ── */}
            <div className="worqu-hero-logo">
                WorQu
            </div>

            <ShootingStars starColor="#4EFFA0" trailColor="#2EE8FF" minSpeed={14} maxSpeed={30} minDelay={1200} maxDelay={3500} style={{ zIndex: 2 }} />
            <ShootingStars starColor="#2dd87a" trailColor="#1aff8e" minSpeed={10} maxSpeed={22} minDelay={2800} maxDelay={5500} style={{ zIndex: 2 }} />

            {/* ── Bottom fade ── */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, zIndex: 2, pointerEvents: 'none',
                background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)',
            }} />

            {/* ── Content ── */}
            <div style={{
                position: 'relative', zIndex: 3,
                width: '100%', maxWidth: 1400, margin: '0 auto',
                padding: '160px 40px 120px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            }}>
                {/* Label */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ marginBottom: 28 }}
                >
                    <span className="overline-chip" style={{ pointerEvents: 'auto' }}>
                        <Zap size={10} /> Built on Quai Network
                    </span>
                </motion.div>

                {/* Headline */}
                <h1 style={{
                    fontSize: 'var(--text-hero)',
                    fontWeight: 800,
                    lineHeight: 1.04,
                    letterSpacing: '-0.04em',
                    color: 'var(--text-primary)',
                    marginBottom: 36,
                    maxWidth: 1000,
                }}>
                    {headline.map((line, li) => (
                        <div key={li} style={{ display: 'block', overflow: 'hidden' }}>
                            {line.split(' ').map((word, wi) => (
                                <motion.span
                                    key={wi}
                                    custom={li * 3 + wi}
                                    initial="hidden"
                                    animate="show"
                                    variants={wordVariant}
                                    style={{
                                        display: 'inline-block',
                                        marginRight: '0.28em',
                                        color: li === 2 ? 'var(--text-secondary)' : li === 0 ? 'var(--text-primary)' : 'var(--text-primary)',
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                    ))}
                </h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.75 }}
                    style={{
                        fontSize: 20,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        maxWidth: 720,
                        marginBottom: 52,
                    }}
                >
                    The first decentralized freelance marketplace on Quai.
                    Escrow costs{' '}
                    <span style={{ color: 'var(--quai-green)', fontFamily: 'var(--font-mono)', fontSize: 18 }}>$0.001</span>.
                    Payment is instant. Every contract is an NFT.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.95 }}
                    style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}
                >
                    <button onClick={onClientClick} className="btn-primary" style={{ border: 'none' }}>
                        Start as Client <ArrowRight size={14} />
                    </button>
                    <a href="#features" className="btn-secondary">
                        <span>Explore Features</span>
                    </a>
                </motion.div>

                {/* Stat pills */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.15 }}
                    style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    {[
                        { icon: <DollarSign size={11} />, label: '$0.001 escrow' },
                        { icon: <Clock size={11} />, label: 'Instant settlement' },
                        { icon: <Users size={11} />, label: 'NFT contracts' },
                    ].map(({ icon, label }) => (
                        <div key={label} className="glass-card" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 7,
                            padding: '7px 16px', fontSize: 11, fontFamily: 'var(--font-mono)',
                            color: '#ffffff', // High contrast white
                            background: 'rgba(255, 255, 255, 0.08)', // Brighter glass
                        }}>
                            <span style={{ color: '#a4ffcf' }}>{icon}</span>
                            <span>{label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Scroll hint ── */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
                style={{
                    position: 'absolute', bottom: 36, left: '50%', zIndex: 3,
                    animation: 'float 2.8s ease-in-out infinite',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    pointerEvents: 'none',
                }}
            >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    scroll
                </span>
                <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--quai-green-dim), transparent)' }} />
            </motion.div>
        </section>
    )
}
