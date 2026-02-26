import { motion } from 'framer-motion'

/**
 * A polished display card inspired by 21st.dev Feature Cards.
 * Glassmorphism border, decorative grid backdrop, hover lift + glow.
 */
export default function DisplayCard({
    icon,
    title,
    description,
    highlight,
    index = 0,
    style = {},
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                padding: '32px 28px',
                cursor: 'default',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                ...style,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(78, 255, 160, 0.25)'
                e.currentTarget.style.boxShadow = '0 0 40px rgba(78, 255, 160, 0.06), 0 8px 32px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            {/* Decorative grid backdrop */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
          linear-gradient(rgba(78,255,160,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(78,255,160,0.03) 1px, transparent 1px)
        `,
                backgroundSize: '24px 24px',
                maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 100%)',
                pointerEvents: 'none',
                opacity: 0.6,
            }} />

            {/* Top accent line */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: 'linear-gradient(to right, transparent, rgba(78,255,160,0.2), transparent)',
            }} />

            {/* Icon */}
            {icon && (
                <div style={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    background: 'var(--quai-green-10)',
                    border: '1px solid var(--quai-green-dim)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    color: 'var(--quai-green)',
                }}>
                    {/* Inner decorative grid on icon */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `
              linear-gradient(rgba(78,255,160,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(78,255,160,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '8px 8px',
                        borderRadius: 'inherit',
                        pointerEvents: 'none',
                    }} />
                    {icon}
                </div>
            )}

            {/* Title */}
            <h3 style={{
                fontSize: 17,
                fontWeight: 700,
                marginBottom: 10,
                letterSpacing: '-0.02em',
                position: 'relative',
            }}>{title}</h3>

            {/* Description */}
            <p style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: highlight ? 16 : 0,
                position: 'relative',
            }}>{description}</p>

            {/* Highlight pill */}
            {highlight && (
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--quai-green)',
                    background: 'var(--quai-green-10)',
                    border: '1px solid var(--quai-green-dim)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '4px 12px',
                    position: 'relative',
                }}>{highlight}</span>
            )}

            {/* Corner glow */}
            <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                background: 'radial-gradient(circle, rgba(78,255,160,0.05), transparent 70%)',
                pointerEvents: 'none',
            }} />
        </motion.div>
    )
}
