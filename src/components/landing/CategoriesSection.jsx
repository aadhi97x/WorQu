import { motion } from 'framer-motion'
import { Code2, PenTool, LineChart, Wrench, Video, BookOpen, ArrowUpRight } from 'lucide-react'

const categories = [
    { icon: <Code2 size={18} />, name: 'Development', count: '2.4k freelancers', hot: true },
    { icon: <PenTool size={18} />, name: 'Design & Creative', count: '1.8k freelancers' },
    { icon: <LineChart size={18} />, name: 'Marketing & Growth', count: '940 freelancers' },
    { icon: <Wrench size={18} />, name: 'Engineering & Tech', count: '1.1k freelancers' },
    { icon: <Video size={18} />, name: 'Video & Animation', count: '670 freelancers' },
    { icon: <BookOpen size={18} />, name: 'Writing & Content', count: '820 freelancers' },
]

export default function CategoriesSection() {
    return (
        <section style={{ padding: '100px 24px', position: 'relative' }}>

            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}
                >
                    <div>
                        <span className="section-label">Categories</span>
                        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                            Every skill.<br />
                            <span className="gradient-text">On-chain.</span>
                        </h2>
                    </div>
                    <a href="#cta" className="btn-secondary" style={{ alignSelf: 'flex-end' }}>
                        Browse all <ArrowUpRight size={14} />
                    </a>
                </motion.div>

                {/* Category grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.45, delay: i * 0.06 }}
                        >
                            <div className="glass-card" style={{
                                padding: '22px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                cursor: 'pointer',
                                position: 'relative',
                            }}>
                                {/* Icon */}
                                <div style={{
                                    width: 40, height: 40, flexShrink: 0,
                                    background: 'var(--quai-green-10)',
                                    border: '1px solid var(--quai-green-dim)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--quai-green)',
                                }}>
                                    {cat.icon}
                                </div>

                                {/* Text */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {cat.name}
                                        </span>
                                        {cat.hot && (
                                            <span style={{
                                                fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
                                                color: 'var(--quai-green)', background: 'var(--quai-green-10)',
                                                border: '1px solid var(--quai-green-dim)',
                                                borderRadius: 'var(--radius-pill)', padding: '1px 7px',
                                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                            }}>HOT</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                        {cat.count}
                                    </div>
                                </div>

                                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
