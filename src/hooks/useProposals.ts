import { useCallback } from 'react'
import { FormattedJob, ONCHAIN_JOB_STATUSES } from './useContracts'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useDemo, DEMO_FREELANCER_ADDRESS } from '@/contexts/DemoContext'
import { DEMO_PROPOSALS, getDemoJobs } from '@/lib/demoData'
import { formatQuai } from '@/lib/quai'

export interface Proposal {
  id?: string
  jobId: number
  freelancerAddress: string
  rate: string        // QUAI amount as string
  coverLetter: string
  submittedAt?: number // unix timestamp
  status: 'pending' | 'accepted' | 'rejected'
  jobDetails?: FormattedJob
}


export function useProposals() {
  const { isDemo } = useDemo()

  const submit = useCallback(async (proposal: Omit<Proposal, 'submittedAt' | 'status'>) => {
    await supabase.from('profiles').upsert({
      wallet_address: proposal.freelancerAddress.toLowerCase(),
      user_type: 'freelancer'
    }, { onConflict: 'wallet_address', ignoreDuplicates: true })

    const { error } = await supabase.from('proposals').insert({
      job_id: proposal.jobId,
      freelancer_address: proposal.freelancerAddress.toLowerCase(),
      rate: Number(proposal.rate),
      cover_letter: proposal.coverLetter,
      status: 'pending'
    })

    if (error) {
      console.warn('Silent proposal sync failure:', error)
      throw error
    }

    toast.success('Proposal submitted!')
  }, [])

  // ── getByJob: Supabase only ──────────────────────────
  const getByJob = useCallback(async (jobId: number): Promise<Proposal[]> => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data.map(d => ({
          id: d.id,
          jobId: d.job_id,
          freelancerAddress: d.freelancer_address,
          rate: formatQuai(d.rate || '0'),
          coverLetter: d.cover_letter,
          submittedAt: Math.floor(new Date(d.created_at).getTime() / 1000),
          status: d.status
        }))
      }
    } catch { }

    return []
  }, [])

  // ── getByWallet: Supabase only ───────────────────────
  const getByWallet = useCallback(async (address: string): Promise<Proposal[]> => {
    const addr = address.toLowerCase()
    let finalProposals: Proposal[] = []

    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*, jobs(*)')
        .eq('freelancer_address', addr)
        .order('created_at', { ascending: false })

      if (!error && data) {
        finalProposals = data.map(d => {
          const jobsData = Array.isArray(d.jobs) ? d.jobs[0] : d.jobs
          return {
            id: d.id,
            jobId: d.job_id,
            freelancerAddress: d.freelancer_address,
            rate: formatQuai(d.rate || '0'), // Robust formatting
            coverLetter: d.cover_letter,
            submittedAt: Math.floor(new Date(d.created_at).getTime() / 1000),
            status: d.status,
            jobDetails: jobsData
          }
        })
      }
    } catch { }

    // Demo mode: Inject mock proposals if wallet is DEMO_FREELANCER_ADDRESS
    if (isDemo && addr === DEMO_FREELANCER_ADDRESS.toLowerCase()) {
      const demoJobs = getDemoJobs()
      const demoWithDetails: Proposal[] = DEMO_PROPOSALS.map(p => {
        const dJob = demoJobs.find(j => Number(j.id) === Number(p.jobId))
        const fJob: FormattedJob | undefined = dJob ? {
          id: Number(dJob.id),
          client: dJob.client,
          freelancer_address: dJob.freelancer !== '0x0000000000000000000000000000000000000000' ? dJob.freelancer : null,
          title: dJob.title,
          description: dJob.description,
          category: dJob.category,
          budget: formatQuai(dJob.budget.toString()),
          deadline: Number(dJob.deadline),
          status: ONCHAIN_JOB_STATUSES[Number(dJob.status)] || 'open',
          createdAt: Number(dJob.createdAt),
          isLocal: false,
          isDemo: true
        } : undefined
        return {
          ...p,
          id: `demo-${p.jobId}`,
          jobDetails: fJob
        }
      })

      const existingJobIds = new Set(finalProposals.map(p => Number(p.jobId)))
      const neededDemo = demoWithDetails.filter(p => !existingJobIds.has(Number(p.jobId)))
      return [...finalProposals, ...neededDemo]
    }

    return finalProposals
  }, [isDemo]) // Add isDemo as it is used inside

  // ── hasSubmitted: Supabase only ────────────────────────────────────────
  const hasSubmitted = useCallback(async (jobId: number, address: string): Promise<boolean> => {
    const addr = address.toLowerCase()

    try {
      const { count, error } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', jobId)
        .eq('freelancer_address', addr)

      if (!error) return (count ?? 0) > 0
    } catch { }

    return false
  }, [])

  // ── withdraw ────────────────────────────────────────────────────────────────
  const withdraw = useCallback(async (jobId: number, address: string) => {
    const addr = address.toLowerCase()

    await supabase
      .from('proposals')
      .delete()
      .eq('job_id', jobId)
      .eq('freelancer_address', addr)
  }, [])

  return { submit, getByJob, getByWallet, hasSubmitted, withdraw }
}
