import { useRef, useState } from 'react'

export default function SpotlightCard({
    children,
    spotlightColor = 'rgba(78, 255, 160, 0.25)',
    spotlightSize = 400,
    style = {},
    className = '',
}) {
    const divRef = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <div
            ref={divRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isHovered
                    ? '0 0 30px rgba(78, 255, 160, 0.08), inset 0 0 30px rgba(78, 255, 160, 0.03)'
                    : undefined,
                transition: 'box-shadow 0.3s ease',
                ...style,
            }}
        >
            {/* Spotlight glow — large, visible radial */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
                    zIndex: 1,
                }}
            />
            {/* Secondary inner glow for extra depth */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    background: `radial-gradient(${spotlightSize * 0.5}px circle at ${position.x}px ${position.y}px, rgba(78, 255, 160, 0.10), transparent 60%)`,
                    zIndex: 1,
                }}
            />
            {/* Content sits above */}
            <div style={{ position: 'relative', zIndex: 2 }}>
                {children}
            </div>
        </div>
    )
}
