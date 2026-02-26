import { useEffect, useRef } from 'react'

export default function SpaceParticles({
    particleCount = 300,
    particleColor = 'rgba(78, 255, 160, 0.85)',
    style = {},
}) {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let ratio = window.innerHeight < 400 ? 0.6 : 1
        const state = { particles: [], r: 120, counter: 0 }

        const setupCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.setTransform(
                ratio * window.devicePixelRatio,
                0,
                0,
                -ratio * window.devicePixelRatio,
                canvas.width / 2,
                canvas.height / 2
            )
        }
        setupCanvas()

        const createParticle = () => {
            state.particles.push({
                color: particleColor,
                radius: Math.random() * 4,
                x: Math.cos(Math.random() * 7 + Math.PI) * state.r,
                y: Math.sin(Math.random() * 7 + Math.PI) * state.r,
                ring: Math.random() * state.r * 3,
                move: (Math.random() * 4 + 1) / 500,
                random: Math.random() * 7,
            })
        }
        for (let i = 0; i < particleCount; i++) createParticle()

        const moveParticle = (p) => {
            p.ring = Math.max(p.ring - 1, state.r)
            p.random += p.move
            p.x = Math.cos(p.random + Math.PI) * p.ring
            p.y = Math.sin(p.random + Math.PI) * p.ring
        }

        const resetParticle = (p) => {
            p.ring = Math.random() * state.r * 3
            p.radius = Math.random() * 4
        }

        const disappear = (p) => {
            if (p.radius < 0.8) resetParticle(p)
            p.radius *= 0.994
        }

        const draw = (p) => {
            ctx.beginPath()
            ctx.fillStyle = p.color
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fill()
        }

        const loop = () => {
            ctx.clearRect(
                -canvas.width,
                -canvas.height,
                canvas.width * 2,
                canvas.height * 2
            )
            if (state.counter < state.particles.length) state.counter++
            for (let i = 0; i < state.counter; i++) {
                disappear(state.particles[i])
                moveParticle(state.particles[i])
                draw(state.particles[i])
            }
            animationRef.current = requestAnimationFrame(loop)
        }

        animationRef.current = requestAnimationFrame(loop)

        const handleResize = () => {
            ratio = window.innerHeight < 400 ? 0.6 : 1
            setupCanvas()
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationRef.current) cancelAnimationFrame(animationRef.current)
        }
    }, [particleCount, particleColor])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                ...style,
            }}
        />
    )
}
