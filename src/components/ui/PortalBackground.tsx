import { MeshGradient } from '@paper-design/shaders-react'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Animated MeshGradient background — bold enough to show through glass cards.
 * Fixed behind all content at z-index 0.
 */
export function PortalBackground() {
    const { theme } = useTheme()

    // Dark: pure black to vivid emerald/forest green — strong contrast with glass cards
    // Light: white to vivid sage/mint — bright and airy
    const darkColors = ['#000000', '#0d3820', '#061f10', '#1a4728']
    const lightColors = ['#ffffff', '#b8e8cc', '#d4f0e0', '#e8f7ef']

    const colors = theme === 'dark' ? darkColors : lightColors

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}
            aria-hidden="true"
        >
            <MeshGradient
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                }}
                colors={colors}
                speed={0.8}
                distortion={1.2}
                swirl={0.4}
                grainMixer={0.06}
                grainOverlay={0.04}
            />

            {/* Strong green pulse glow — bottom-left */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-8%',
                    width: 700,
                    height: 700,
                    borderRadius: '50%',
                    background:
                        theme === 'dark'
                            ? 'radial-gradient(circle, rgba(78,255,160,0.13) 0%, transparent 60%)'
                            : 'radial-gradient(circle, rgba(26,159,96,0.15) 0%, transparent 60%)',
                    filter: 'blur(50px)',
                    pointerEvents: 'none',
                }}
            />

        </div>
    )
}
