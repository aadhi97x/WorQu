import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedGridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    numSquares = 50,
    maxOpacity = 0.5,
    duration = 4,
    repeatDelay = 0.5,
    fillColor = 'rgba(78, 255, 160, 0.3)',
    strokeColor = 'rgba(78, 255, 160, 0.08)',
    style = {},
    maskStyle = 'radial-gradient(500px circle at center, black, transparent)',
}) {
    const id = useId()
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    function getPos() {
        return [
            Math.floor((Math.random() * dimensions.width) / width),
            Math.floor((Math.random() * dimensions.height) / height),
        ]
    }

    const [squares, setSquares] = useState(() =>
        Array.from({ length: numSquares }, (_, i) => ({ id: i, pos: [0, 0] }))
    )

    const updateSquarePosition = (sqId) => {
        setSquares(curr =>
            curr.map(sq => (sq.id === sqId ? { ...sq, pos: getPos() } : sq))
        )
    }

    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            setSquares(
                Array.from({ length: numSquares }, (_, i) => ({
                    id: i,
                    pos: [
                        Math.floor((Math.random() * dimensions.width) / width),
                        Math.floor((Math.random() * dimensions.height) / height),
                    ],
                }))
            )
        }
    }, [dimensions, numSquares, width, height])

    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                })
            }
        })
        if (containerRef.current) obs.observe(containerRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                fill: fillColor,
                stroke: strokeColor,
                WebkitMaskImage: maskStyle,
                maskImage: maskStyle,
                ...style,
            }}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path d={`M.5 ${height}V.5H${width}`} fill="none" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
            <svg x={x} y={y} style={{ overflow: 'visible' }}>
                {squares.map(({ pos: [sx, sy], id: sqId }, index) => (
                    <motion.rect
                        key={`${sx}-${sy}-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: 1,
                            delay: index * 0.1,
                            repeatType: 'reverse',
                        }}
                        onAnimationComplete={() => updateSquarePosition(sqId)}
                        width={width - 1}
                        height={height - 1}
                        x={sx * width + 1}
                        y={sy * height + 1}
                        fill="currentColor"
                        strokeWidth="0"
                    />
                ))}
            </svg>
        </svg>
    )
}
