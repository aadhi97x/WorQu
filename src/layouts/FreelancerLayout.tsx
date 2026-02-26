import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { NavBar } from '@/components/shared/NavBar'
import { AnimatePresence, motion } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { quais } from 'quais'
import { ESCROW_ADDR } from '@/lib/quai'
import JobEscrowABI from '../../abi/JobEscrow.json'
import { CheckCircle } from 'lucide-react'
import { PortalBackground } from '@/components/ui/PortalBackground'

export function FreelancerLayout() {
  const { address, provider } = useWallet()
  const [hiredJob, setHiredJob] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!address || !provider) return
    const contract = new quais.Contract(ESCROW_ADDR, JobEscrowABI, provider)

    const onProposalAccepted = async (jobId: bigint, freelancer: string) => {
      if (freelancer.toLowerCase() === address.toLowerCase()) {
        try {
          const job = await contract.getJob(Number(jobId))
          setHiredJob({ jobId: Number(jobId), title: job.title, budget: job.budget })
        } catch (e) {
          console.error('Failed to fetch job details for notification', e)
        }
      }
    }

    contract.on('ProposalAccepted', onProposalAccepted)
    return () => { contract.removeAllListeners() }
  }, [address, provider])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PortalBackground />
      <NavBar mode="freelancer" />
      <main style={{ flex: 1, paddingTop: 64, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {hiredJob && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(10, 11, 15, 0.95)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ maxWidth: 480, padding: 48, textAlign: 'center', animation: 'fadeUp 0.4s ease-out both' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
              background: 'var(--quai-green-10)', border: '2px solid var(--quai-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'expandCircle 0.5s cubic-bezier(0.16,1,0.3,1) both'
            }}>
              <CheckCircle size={48} color="var(--quai-green)" />
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginTop: 24, animation: 'fadeUp 0.4s ease-out both', animationDelay: '0.2s' }}>
              🎉 You've been hired!
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, animation: 'fadeUp 0.4s ease-out both', animationDelay: '0.3s' }}>
              Work Agreement NFT minted to your wallet
            </p>

            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--quai-green-dim)',
              borderRadius: 'var(--radius-lg)', padding: 20, marginTop: 24,
              animation: 'fadeUp 0.4s ease-out both', animationDelay: '0.4s',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Job</span>
                <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{hiredJob.title}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Escrow</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--quai-green)' }}>{hiredJob.budget} QUAI</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center', animation: 'fadeUp 0.4s ease-out both', animationDelay: '0.5s' }}>
              <button onClick={() => setHiredJob(null)} className="btn-secondary">
                Dismiss
              </button>
              <button onClick={() => {
                setHiredJob(null)
                navigate('/freelancer/contracts')
              }} className="btn-primary">
                Go to Active Contracts →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
