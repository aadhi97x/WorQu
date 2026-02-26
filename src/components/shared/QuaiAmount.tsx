import { formatQuai } from '@/lib/quai'

interface Props {
  amount: bigint | number | string
  size?: 'sm' | 'md' | 'lg'
}

export function QuaiAmount({ amount, size = 'md' }: Props) {
  const formatted = formatQuai(amount)

  const sizeStyles = {
    sm: { fontSize: 13 },
    md: { fontSize: 18 },
    lg: { fontSize: 24, fontWeight: 700 }
  }

  return (
    <span className="amount-quai" style={{ display: 'inline-flex', alignItems: 'baseline', ...sizeStyles[size] }}>
      {formatted}
      <span style={{ color: 'var(--text-muted)', fontSize: '80%', marginLeft: 4, fontWeight: 400 }}>QUAI</span>
    </span>
  )
}
