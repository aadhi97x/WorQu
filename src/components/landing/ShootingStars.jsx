import { useEffect, useState, useRef, useId } from 'react'

const getRandomStartPoint = () => {
    const side = Math.floor(Math.random() * 4)
    const offset = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
    switch (side) {
        case 0: return { x: offset, y: 0, angle: 45 }
        case 1: return { x: (typeof window !== 'undefined' ? window.innerWidth : 1200), y: offset, angle: 135 }
        case 2: return { x: offset, y: (typeof window !== 'undefined' ? window.innerHeight : 800), angle: 225 }
        case 3: return { x: 0, y: offset, angle: 315 }
        default: return { x: 0, y: 0, angle: 45 }
    }
}

export default function ShootingStars({
    minSpeed = 10,
    maxSpeed = 30,
    minDelay = 1200,
    maxDelay = 4200,
    starColor = '#4EFFA0',
    trailColor = '#2EB9DF',
    starWidth = 10,
    starHeight = 1,
    style = {},
}) {
    const [star, setStar] = useState(null)
    const svgRef = useRef(null)
    const gradientId = useId()

    useEffect(() => {
        let timeout
        const createStar = () => {
            const { x, y, angle } = getRandomStartPoint()
            setStar({
                id: Date.now(),
                x, y, angle,
                scale: 1,
                speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
                distance: 0,
            })
            const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay
            timeout = setTimeout(createStar, randomDelay)
        }
        createStar()
        return () => clearTimeout(timeout)
    }, [minSpeed, maxSpeed, minDelay, maxDelay])

    useEffect(() => {
        const moveStar = () => {
            setStar(prev => {
                if (!prev) return null
                const newX = prev.x + prev.speed * Math.cos((prev.angle * Math.PI) / 180)
                const newY = prev.y + prev.speed * Math.sin((prev.angle * Math.PI) / 180)
                const newDistance = prev.distance + prev.speed
                const newScale = 1 + newDistance / 100
                const w = typeof window !== 'undefined' ? window.innerWidth : 1200
                const h = typeof window !== 'undefined' ? window.innerHeight : 800
                if (newX < -20 || newX > w + 20 || newY < -20 || newY > h + 20) return null
                return { ...prev, x: newX, y: newY, distance: newDistance, scale: newScale }
            })
        }
        const frame = requestAnimationFrame(moveStar)
        return () => cancelAnimationFrame(frame)
    }, [star])

    return (
        <svg
            ref={svgRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
                ...style,
            }}
        >
            {star && (
                <rect
                    key={star.id}
                    x={star.x}
                    y={star.y}
                    width={starWidth * star.scale}
                    height={starHeight}
                    fill={`url(#${gradientId})`}
                    transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
                />
            )}
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
                    <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
                </linearGradient>
            </defs>
        </svg>
    )
}
