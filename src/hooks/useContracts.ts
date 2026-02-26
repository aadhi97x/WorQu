import { useCallback } from 'react'
import { quais } from 'quais'
import { useWallet } from './useWallet'
import { ESCROW_ADDR, NFT_ADDR, getRpcProvider, formatQuai, parseQuai } from '@/lib/quai'
import { useDemo } from '@/contexts/DemoContext'
import { DEMO_NFTS, DEMO_JOBS } from '@/lib/demoData'
import JobEscrowABI from '../../abi/JobEscrow.json'
import WorkAgreementABI from '../../abi/WorkAgreementNFT.json'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

export interface OnChainJob {
  id: bigint | string | number;
  client: string;
  freelancer: string;
  title: string;
  description: string;
  budget: bigint | string | number;
  deadline: bigint | string | number;
  status: number | string;
  createdAt: bigint | string | number;
  category: string;
}

export interface FormattedJob {
  id: number;
  client: string;
  freelancer_address: string | null;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: number;
  status: string;
  createdAt: number;
  isLocal: boolean;
  isDemo?: boolean;
}

export const ONCHAIN_JOB_STATUSES = ['open', 'funded', 'in_progress', 'completed', 'disputed', 'refunded'] as const;

export function useContracts() {
  const { getSigner, address } = useWallet()
  const { isDemo } = useDemo()

  const readEscrow = useCallback(() =>
    new quais.Contract(ESCROW_ADDR, JobEscrowABI, getRpcProvider()), [])

  const writeEscrow = useCallback(async () => {
    const signer = await getSigner()
    return new quais.Contract(ESCROW_ADDR, JobEscrowABI, signer)
  }, [getSigner])

  const readNFT = useCallback(() =>
    new quais.Contract(NFT_ADDR, WorkAgreementABI, getRpcProvider()), [])

  // ── Reads ───────────────────────────────────────────────
  const getAllJobs = useCallback(async () => {
    try {
      // 1. Fetch from blockchain
      const c = readEscrow()
      const onChainJobs = await c.getAllJobs()

      const formatted: FormattedJob[] = onChainJobs.map((j: OnChainJob) => ({
        id: Number(j.id),
        client: j.client,
        freelancer_address: j.freelancer !== '0x0000000000000000000000000000000000000000' ? j.freelancer : null,
        title: j.title,
        description: j.description,
        category: j.category,
        budget: formatQuai(j.budget),
        deadline: Number(j.deadline),
        status: ONCHAIN_JOB_STATUSES[Number(j.status)] || 'open',
        createdAt: Number(j.createdAt),
        isLocal: false
      }))

      let finalJobs: FormattedJob[] = formatted

      const formattedDemo: FormattedJob[] = DEMO_JOBS.map((j: any) => ({
        id: Number(j.id),
        client: j.client,
        freelancer_address: j.freelancer !== '0x0000000000000000000000000000000000000000' ? j.freelancer : null,
        title: j.title,
        description: j.description,
        category: j.category,
        budget: formatQuai(j.budget),
        deadline: Number(j.deadline),
        status: ONCHAIN_JOB_STATUSES[Number(j.status)] || 'open',
        createdAt: Number(j.createdAt),
        isLocal: false,
        isDemo: true
      }))
      finalJobs = [...formatted, ...formattedDemo]

      // Sort by id descending
      return finalJobs.sort((a: FormattedJob, b: FormattedJob) => b.id - a.id)
    } catch (e) {
      console.error('Failed to fetch jobs from chain:', e)
      toast.error('Smart contract connection failed. Loading demo records.')

      // Fallback to demo data if chain fails
      return DEMO_JOBS.map((j: any): FormattedJob => ({
        id: Number(j.id),
        client: j.client,
        freelancer_address: j.freelancer !== '0x0000000000000000000000000000000000000000' ? j.freelancer : null,
        title: j.title,
        description: j.description,
        category: j.category,
        budget: formatQuai(j.budget),
        deadline: Number(j.deadline),
        status: ONCHAIN_JOB_STATUSES[Number(j.status)] || 'open',
        createdAt: Number(j.createdAt),
        isLocal: false,
        isDemo: true
      })).sort((a, b) => b.id - a.id)
      return []
    }
  }, [readEscrow])

  const getJob = useCallback(async (id: number) => {
    try {
      const c = readEscrow()
      const j = await c.getJob(id)

      // Also check Supabase for "web" statuses like 'review_pending'
      const { data: dbJob } = await supabase.from('jobs').select('status').eq('id', id).single()

      const statusIndex = Number(j.status)
      let status: string = ONCHAIN_JOB_STATUSES[statusIndex] || 'open'

      // If Supabase says it's review_pending, and it's active on-chain, use that
      if (dbJob?.status === 'review_pending' && status === 'in_progress') {
        status = 'review_pending'
      }

      return {
        id: Number(j.id),
        client: j.client,
        freelancer_address: j.freelancer !== '0x0000000000000000000000000000000000000000' ? j.freelancer : null,
        title: j.title,
        description: j.description,
        category: j.category,
        budget: formatQuai(j.budget),
        deadline: Number(j.deadline),
        status,
        createdAt: Number(j.createdAt),
        isLocal: false
      }
    } catch (e) {
      console.error("Error in getJob:", e)
      toast.error("Failed to load on-chain job details.")
      return null
    }
  }, [readEscrow])

  // ── Writes ──────────────────────────────────────────────
  const postJob = useCallback(async (
    title: string, description: string, category: string,
    deadline: number, budgetQuai: string
  ) => {
    if (!address) throw new Error("Wallet not connected")

    // Ensure client profile exists in Postgres
    await supabase.from('profiles').upsert({
      wallet_address: address.toLowerCase(),
      user_type: 'client'
    }, { onConflict: 'wallet_address', ignoreDuplicates: true })

    const c = await writeEscrow()
    console.log("Posting Job Tx...")
    const tx = await c.postJob(title, description, category, deadline, { value: parseQuai(budgetQuai) })
    const receipt = await tx.wait()

    // Parse the event to get the actual jobId from the contract
    let newJobId = Date.now() // fallback
    for (const log of receipt.logs) {
      try {
        const parsed = c.interface.parseLog(log)
        console.log("Parsed Log", parsed)
        if (parsed?.name === 'JobPosted') {
          newJobId = Number(parsed.args[0])
          break
        }
      } catch (e) {
        // Log might belong to another contract
      }
    }

    // Attempt Supabase upsert in background
    supabase.from('jobs').upsert({
      id: newJobId,
      client_address: address.toLowerCase(),
      title,
      description,
      category,
      deadline,
      budget: Number(budgetQuai),
      status: 'open'
    }).then(({ error }) => {
      if (error) console.error('Silent background DB sync failure:', error)
    })

    return receipt
  }, [writeEscrow, address])

  const acceptProposal = useCallback(async (
    jobId: number, freelancerAddress: string, tokenURI: string
  ) => {
    const jobIdNum = Number(jobId)
    const fAddr = freelancerAddress.toLowerCase()

    console.log("Accepting proposal on-chain - Params:", { jobIdNum, fAddr, tokenURI })
    try {
      const c = await writeEscrow()
      console.log("Escrow contract obtained at:", c.target)

      const tx = await c.acceptProposal(jobIdNum, fAddr, tokenURI)
      console.log("Transaction sent:", tx.hash)

      const receipt = await tx.wait()
      console.log("Transaction mined:", receipt)

      try {
        // 2. DB sync (non-blocking if it fails, but we try)
        const { error: pErr } = await supabase.from('proposals').update({ status: 'accepted' }).eq('job_id', jobId).eq('freelancer_address', fAddr)
        const { error: jErr } = await supabase.from('jobs').update({
          status: 'in_progress',
          freelancer_address: fAddr // Record who was hired
        }).eq('id', jobId)

        if (pErr) console.warn('Supabase proposal update failed:', pErr)
        if (jErr) console.warn('Supabase job update failed:', jErr)

        // 3. Local storage update for immediate freelancer feedback
        const localProposals = JSON.parse(localStorage.getItem('quaiwork_local_proposals') || '[]')
        const updatedProposals = localProposals.map((p: any) =>
          (Number(p.jobId) === Number(jobId) && p.freelancerAddress.toLowerCase() === fAddr)
            ? { ...p, status: 'accepted' }
            : p
        )
        localStorage.setItem('quaiwork_local_proposals', JSON.stringify(updatedProposals))

      } catch (e) {
        console.warn('DB/Local sync failed during acceptProposal:', e)
      }

      return receipt
    } catch (err: any) {
      console.error("acceptProposal on-chain error:", err)
      throw err
    }
  }, [writeEscrow, address])

  const markDelivered = useCallback(async (jobId: number) => {
    // 1. On-chain sync
    const c = await writeEscrow()
    const tx = await c.markJobDelivered(jobId)
    await tx.wait()

    // 2. DB sync
    await supabase.from('jobs').update({ status: 'review_pending' }).eq('id', jobId)
  }, [writeEscrow])

  const releasePayment = useCallback(async (jobId: number, rating?: number, comment?: string) => {
    const c = await writeEscrow()
    const tx = await c.releasePayment(jobId)
    const receipt = await tx.wait()

    // 2. DB sync
    const { data: dbJob } = await supabase.from('jobs').select('freelancer_address').eq('id', jobId).single()
    let freelancer_address = ''
    if (dbJob?.freelancer_address) freelancer_address = dbJob.freelancer_address

    await supabase.from('jobs').update({ status: 'completed' }).eq('id', jobId)

    // Save rating if provided
    if (rating && freelancer_address) {
      const addr = freelancer_address.toLowerCase()
      // Async insert to Supabase ratings table
      supabase.from('ratings').insert({
        job_id: jobId,
        freelancer_address: addr,
        client_address: address.toLowerCase(),
        rating,
        comment
      }).then(({ error }) => {
        if (error) console.error('Failed to sync rating to Supabase:', error)
      })
    }

    return receipt
  }, [writeEscrow])

  const raiseDispute = useCallback(async (jobId: number) => {
    const c = await writeEscrow()
    const tx = await c.raiseDispute(jobId)
    const receipt = await tx.wait()

    // 2. DB sync
    await supabase.from('jobs').update({ status: 'disputed' }).eq('id', jobId)

    return receipt
  }, [writeEscrow])

  // ── NFT reads ───────────────────────────────────────────
  const getAgreement = useCallback(async (tokenId: number) => {
    try {
      return await readNFT().getAgreement(tokenId)
    } catch (e) {
      console.error(e)
      return null
    }
  }, [readNFT])

  const getWalletNFTs = useCallback(async (walletAddress: string) => {
    const nft = readNFT()
    const escrow = readEscrow()
    const addr = walletAddress.toLowerCase()

    try {
      // 1. Try Optimized Event Query (requires indexed event in contract)
      let events: any[] = []
      try {
        const filter = nft.filters.AgreementMinted(null, null, null, addr)
        events = await nft.queryFilter(filter)
      } catch (err) {
        console.warn("Optimized event query failed (RPC limits), falling back to parallel scan:", err)
      }

      if (events.length > 0) {
        const owned = []
        for (const event of events) {
          try {
            const tokenId = Number((event as any).args[0])
            const ag = await nft.getAgreement(tokenId)
            const job = await escrow.getJob(Number(ag.jobId))

            owned.push({
              tokenId,
              jobId: Number(ag.jobId),
              client: ag.client,
              freelancer: ag.freelancer,
              amount: ag.amount.toString(),
              status: ag.status,
              createdAt: Number(ag.createdAt),
              jobTitle: job.title,
              jobDescription: job.description
            })
          } catch (e) {
            console.warn("Event detail fetch fail:", e)
          }
        }
        return owned
      }

      // 2. Fallback: Parallel Scan (for older contracts/non-indexed events)
      console.log("Falling back to full NFT scan...")
      const total = Number(await nft.tokenIds())
      const tokenIds = Array.from({ length: total }, (_, i) => i)

      const results = await Promise.all(tokenIds.map(async (id) => {
        try {
          const owner = await nft.ownerOf(id)
          const ag = await nft.getAgreement(id)
          if (owner.toLowerCase() === addr || ag.freelancer.toLowerCase() === addr) {
            const job = await escrow.getJob(Number(ag.jobId))
            return {
              tokenId: id,
              jobId: Number(ag.jobId),
              client: ag.client,
              freelancer: ag.freelancer,
              amount: ag.amount.toString(),
              status: ag.status,
              createdAt: Number(ag.createdAt),
              jobTitle: job.title,
              jobDescription: job.description
            }
          }
        } catch { }
        return null
      }))

      let finalNfts = results.filter(Boolean)

      // Include demo NFTs that are relevant to this wallet if any
      const myDemoNfts = DEMO_NFTS.filter(n =>
        n.freelancer.toLowerCase() === addr || n.client.toLowerCase() === addr
      ).map(n => ({
        tokenId: n.tokenId,
        jobId: 0, // Mock id for demo
        client: n.client,
        freelancer: n.freelancer,
        amount: n.amount.toString(),
        status: 3, // Completed
        createdAt: n.completedAt,
        jobTitle: n.jobTitle,
        jobDescription: 'Completed through QuaiWork historical records'
      }))
      finalNfts = [...finalNfts, ...myDemoNfts]

      return finalNfts
    } catch (e) {
      console.error("Hybrid NFT fetch error:", e)
      toast.error("Failed to fetch on-chain portfolio. Showing historical data.")
      return DEMO_NFTS.filter(n =>
        n.freelancer.toLowerCase() === addr || n.client.toLowerCase() === addr
      ).map(n => ({
        tokenId: n.tokenId,
        jobId: 0,
        client: n.client,
        freelancer: n.freelancer,
        amount: n.amount.toString(),
        status: 3,
        createdAt: n.completedAt,
        jobTitle: n.jobTitle,
        jobDescription: 'Completed through QuaiWork historical records'
      }))
    }
  }, [readNFT, readEscrow])

  const getFreelancerRating = useCallback(async (freelancerAddress: string) => {
    const addr = freelancerAddress.toLowerCase()
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('freelancer_address', addr)

      if (error || !data || data.length === 0) {
        return { average: 0, count: 0, reviews: [] }
      }

      const total = data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0)
      return { average: total / data.length, count: data.length, reviews: data }
    } catch {
      return { average: 0, count: 0, reviews: [] }
    }
  }, [])

  return { getAllJobs, getJob, postJob, acceptProposal, markDelivered, releasePayment, raiseDispute, getAgreement, getWalletNFTs, getFreelancerRating }
}
