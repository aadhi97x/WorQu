import { useState } from 'react'
import { Info } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useProposals } from '@/hooks/useProposals'
import { formatQuai, quaiToQi, qiToKwh } from '@/lib/quai'
import toast from 'react-hot-toast'

interface Props {
  job: any
  onSubmitted: () => void
}

export function ProposalForm({ job, onSubmitted }: Props) {
  const { address, isConnected } = useWallet()
  const { submit } = useProposals()
  const [rate, setRate] = useState(formatQuai(job.budget))
  const [coverLetter, setCoverLetter] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const numRate = parseFloat(rate) || 0
  const qi = quaiToQi(numRate)
  const kwh = qiToKwh(qi)

  const isValid = isConnected && numRate > 0 && coverLetter.length >= 100

  const handleSubmit = async () => {
    if (!isValid) return
    setIsSubmitting(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      submit({
        jobId: Number(job.id),
        freelancerAddress: address!,
        rate,
        coverLetter
      })

      toast.success('Proposal submitted! 🎉')
      onSubmitted()
    } catch (e) {
      toast.error('Failed to submit proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card" style={{ padding: 24, border: '1px solid var(--border-default)' }}>
      {/* Top: Budget display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--quai-green)', fontWeight: 500 }}>
          {formatQuai(job.budget)} QUAI
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Budget posted by client</span>
      </div>

      <hr className="divider" />

      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
        Submit a Proposal
      </h3>

      {/* Field: YOUR RATE */}
      <div style={{ marginBottom: 20 }}>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>YOUR RATE (QUAI)</label>
        <input
          type="number"
          className="input"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 24, color: 'var(--quai-green)', padding: '12px 16px' }}
          value={rate}
          onChange={e => setRate(e.target.value)}
          placeholder="0.00"
          step="0.01"
        />
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
          ≈ {qi.toFixed(2)} Qi · ≈ {kwh.toFixed(1)} kWh
        </div>
      </div>

      {/* Field: COVER LETTER */}
      <div style={{ marginBottom: 20 }}>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>COVER LETTER</label>
        <textarea
          className="input"
          style={{ minHeight: 140, resize: 'vertical', padding: 14, lineHeight: 1.6 }}
          placeholder="Tell the client why you're the right person for this job. Include relevant experience and how you'll approach the work."
          value={coverLetter}
          onChange={e => setCoverLetter(e.target.value)}
        />
        <div style={{
          marginTop: 8, fontSize: 11, fontFamily: 'var(--font-mono)',
          color: coverLetter.length < 100 ? 'var(--error)' : 'var(--text-muted)'
        }}>
          {coverLetter.length} / 100 minimum
        </div>
      </div>

      <div style={{
        marginTop: 12, padding: 10, background: 'var(--quai-green-10)',
        border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)',
        display: 'flex', gap: 8, alignItems: 'flex-start'
      }}>
        <Info size={12} color="var(--quai-green)" style={{ marginTop: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Proposals are reviewed off-chain. The client accepts on their dashboard, which triggers an NFT mint to your wallet.
        </span>
      </div>

      <button
        className={`btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
        style={{ width: '100%', marginTop: 20, padding: 12 }}
        disabled={!isValid || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Proposal →'}
      </button>
    </div>
  )
}
