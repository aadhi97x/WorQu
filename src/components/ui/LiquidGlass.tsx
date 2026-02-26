"use client";

import React from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GlassEffectProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    href?: string;
    target?: string;
}

// ─── SVG Distortion Filter ───────────────────────────────────────────────────
// Inject once near the root (e.g., in App.tsx or a layout)

export const GlassFilter: React.FC = () => (
    <svg style={{ display: "none" }}>
        <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
        >
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.001 0.005"
                numOctaves={1}
                seed={17}
                result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
                <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
                <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
            <feSpecularLighting
                in="softMap"
                surfaceScale={5}
                specularConstant={1}
                specularExponent={100}
                lightingColor="white"
                result="specLight"
            >
                <fePointLight x={-200} y={-200} z={300} />
            </feSpecularLighting>
            <feComposite
                in="specLight"
                operator="arithmetic"
                k1={0}
                k2={1}
                k3={1}
                k4={0}
                result="litImage"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale={25}
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    </svg>
);

// ─── GlassEffect Wrapper ─────────────────────────────────────────────────────
// Wrap any content with this to get the liquid glass distortion effect

export const GlassEffect: React.FC<GlassEffectProps> = ({
    children,
    className = "",
    style = {},
    href,
    target = "_blank",
}) => {
    const glassStyle: React.CSSProperties = {
        boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
        ...style,
    };

    const content = (
        <div
            className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-700 ${className}`}
            style={glassStyle}
        >
            {/* Distortion layer */}
            <div
                className="absolute inset-0 z-0 overflow-hidden rounded-inherit rounded-3xl"
                style={{
                    backdropFilter: "blur(3px)",
                    filter: "url(#glass-distortion)",
                    isolation: "isolate",
                }}
            />
            {/* Tint layer */}
            <div
                className="absolute inset-0 z-10 rounded-inherit"
                style={{ background: "rgba(255, 255, 255, 0.12)" }}
            />
            {/* Inner border highlight */}
            <div
                className="absolute inset-0 z-20 rounded-inherit rounded-3xl overflow-hidden"
                style={{
                    boxShadow:
                        "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.35), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.25)",
                }}
            />
            {/* Content */}
            <div className="relative z-30 w-full">{children}</div>
        </div>
    );

    return href ? (
        <a href={href} target={target} rel="noopener noreferrer" className="block">
            {content}
        </a>
    ) : (
        content
    );
};

// ─── GlassCard ───────────────────────────────────────────────────────────────
// Drop-in card with liquid glass effect (from 21st.dev)

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Add the SVG filter effect (requires GlassFilter in DOM) */
    liquid?: boolean;
}

export const LiquidGlassCard: React.FC<GlassCardProps> = ({
    children,
    className = "",
    liquid = true,
    style,
    ...props
}) => {
    if (liquid) {
        return (
            <GlassEffect
                className={`rounded-2xl p-0 ${className}`}
                style={style}
            >
                <div className="w-full" style={{ padding: "inherit" }} {...props}>
                    {children}
                </div>
            </GlassEffect>
        );
    }

    return (
        <div
            className={`relative overflow-hidden rounded-2xl ${className}`}
            style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow:
                    "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export default LiquidGlassCard;
