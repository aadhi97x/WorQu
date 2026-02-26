import React from 'react'

interface Props {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 'var(--radius-sm)', className = '', style }: Props) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius, ...style }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <Skeleton width="60%" height={24} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={16} style={{ marginBottom: 24 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width="30%" height={20} />
        <Skeleton width="20%" height={20} />
      </div>
    </div>
  )
}

export function SkeletonStat() {
  return (
    <div className="stat-card">
      <Skeleton width={80} height={14} style={{ marginBottom: 16 }} />
      <Skeleton width={120} height={32} />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <Skeleton width={40} height={40} borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={14} />
      </div>
      <Skeleton width={80} height={24} borderRadius="var(--radius-pill)" />
    </div>
  )
}
