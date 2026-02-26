interface Props {
  status: 'open' | 'active' | 'completed' | 'disputed' | 'pending' | 'refunded' | 'review_pending'
}

const labels = {
  open: 'OPEN',
  active: 'ACTIVE',
  completed: 'COMPLETED',
  disputed: 'DISPUTED',
  pending: 'PENDING',
  refunded: 'REFUNDED',
  review_pending: 'REVIEW PENDING'
}

export function StatusBadge({ status }: Props) {
  return <span className={`badge badge-${status}`}>{labels[status]}</span>
}
