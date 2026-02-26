import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'

const links = {
    Product: ['Features', 'How it Works', 'Categories', 'Roadmap'],
    Developers: ['Smart Contracts', 'API Docs', 'GitHub', 'Audit Report'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
}

export default function Footer() {
    return (
        <footer style={{ position: 'relative', overflow: 'hidden' }}>

            {/* Top divider */}
            <div className="section-line" />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 40px' }}>

                {/* Main grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 48, marginBottom: 64 }}>

                    {/* Brand */}
                    <div>
                        <div style={{ marginBottom: 20 }}>
                            <span style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 16, fontWeight: 700,
                                color: 'var(--quai-green)',
                                letterSpacing: '0.04em',
                            }}>QuaiWork</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 220, marginBottom: 24 }}>
                            Decentralized freelance marketplace on Quai Network. Trustless. Instant. Permissionless.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {[Github, Twitter].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: 36, height: 36,
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'border-color 0.25s, color 0.25s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--quai-green-dim)'; e.currentTarget.style.color = 'var(--quai-green)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <div style={{
                                fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)', letterSpacing: '0.12em',
                                textTransform: 'uppercase', marginBottom: 20,
                            }}>{section}</div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" style={{
                                            fontSize: 13, color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="section-line" style={{ marginBottom: 24 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        © 2025 QuaiWork. Built on Quai Network.
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--quai-green)' }}>_</span> open source
                    </span>
                </div>
            </div>
        </footer>
    )
}
