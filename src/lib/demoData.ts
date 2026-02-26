// Demo mock data — all jobs posted by the demo client so they appear on both sides
import { DEMO_CLIENT_ADDRESS, DEMO_FREELANCER_ADDRESS } from '@/contexts/DemoContext'

const now = Math.floor(Date.now() / 1000)
const day = 86400

export const DEMO_JOBS = [
    {
        id: 1n,
        title: 'Build a DeFi Dashboard with Quai Network Integration',
        description: 'We need a senior React developer to build a DeFi analytics dashboard. The dashboard should display token prices, liquidity pools, and yield farming opportunities on Quai Network. Must include wallet connection via Pelagus and real-time data fetching.',
        category: 'Development',
        budget: BigInt('2000000000000000000'), // 2 QUAI
        deadline: BigInt(now + 14 * day),
        createdAt: BigInt(now - 2 * day),
        status: 1n,
        client: DEMO_CLIENT_ADDRESS,
        freelancer: '0x0000000000000000000000000000000000000000',
    },
    {
        id: 2n,
        title: 'Design a Web3 Brand Identity & UI Kit',
        description: "Looking for an experienced Web3 designer to create a complete brand identity package including logo, color system, typography, and a reusable Figma UI kit for a decentralized freelance marketplace. Deliverables: Figma file, exported assets, brand guidelines PDF.",
        category: 'Design',
        budget: BigInt('1500000000000000000'), // 1.5 QUAI
        deadline: BigInt(now + 21 * day),
        createdAt: BigInt(now - 1 * day),
        status: 1n,
        client: DEMO_CLIENT_ADDRESS,
        freelancer: '0x0000000000000000000000000000000000000000',
    },
    {
        id: 3n,
        title: 'Write 10 Technical Blog Posts on Quai Network',
        description: "We are looking for a skilled technical writer to produce 10 in-depth blog posts explaining Quai Network's architecture, consensus mechanism, and developer ecosystem. Each post should be 1,500–2,500 words with code examples where relevant.",
        category: 'Writing',
        budget: BigInt('800000000000000000'), // 0.8 QUAI
        deadline: BigInt(now + 30 * day),
        createdAt: BigInt(now - 3 * day),
        status: 1n,
        client: DEMO_CLIENT_ADDRESS,
        freelancer: '0x0000000000000000000000000000000000000000',
    },
    {
        id: 4n,
        title: 'Smart Contract Audit – ERC-20 Token with Staking',
        description: 'Our ERC-20 token contract with integrated staking and rewards distribution needs a thorough security audit. The contract is approximately 450 lines of Solidity. Deliverables include a detailed vulnerability report with severity ratings and remediation recommendations.',
        category: 'Web3',
        budget: BigInt('5000000000000000000'), // 5 QUAI
        deadline: BigInt(now + 7 * day),
        createdAt: BigInt(now - 4 * day),
        status: 1n,
        client: DEMO_CLIENT_ADDRESS,
        freelancer: '0x0000000000000000000000000000000000000000',
    },
    {
        id: 5n,
        title: 'React Native Mobile Wallet App for Quai',
        description: 'Seeking an experienced React Native developer to build a mobile crypto wallet for iOS and Android. Features: QR code scanning, transaction history, real-time price feeds, push notifications for incoming transactions, and biometric authentication.',
        category: 'Mobile',
        budget: BigInt('8000000000000000000'), // 8 QUAI
        deadline: BigInt(now + 45 * day),
        createdAt: BigInt(now - 5 * day),
        status: 2n, // Active contract
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
    },
    {
        id: 6n,
        title: 'Node.js Backend for NFT Marketplace API',
        description: 'Build a scalable REST API using Node.js and Express for our NFT marketplace.',
        category: 'Development',
        budget: BigInt('3500000000000000000'), // 3.5 QUAI
        deadline: BigInt(now + 28 * day),
        createdAt: BigInt(now - 6 * day),
        status: 1n,
        client: DEMO_CLIENT_ADDRESS,
        freelancer: '0x0000000000000000000000000000000000000000',
    },
    {
        id: 7n,
        title: 'Video Editor for Project Documentary',
        description: 'We need a creative video editor to assemble a 5-minute documentary about our blockchain ecosystem.',
        category: 'Video',
        budget: BigInt('1200000000000000000'), // 1.2 QUAI
        deadline: BigInt(now + 10 * day),
        createdAt: BigInt(now - 8 * day),
        status: 3n, // Completed
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
    },
    {
        id: 8n,
        title: 'Cybersecurity Consultant – Penetration Test',
        description: 'Perform a full penetration test on our infrastructure and report vulnerabilities.',
        category: 'Security',
        budget: BigInt('4000000000000000000'), // 4.0 QUAI
        deadline: BigInt(now + 15 * day),
        createdAt: BigInt(now - 10 * day),
        status: 1n,
        client: '0x1c2b3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u',
        freelancer: '0x0000000000000000000000000000000000000000',
    },
]

export const DEMO_NFTS = [
    {
        tokenId: 1,
        jobTitle: 'Quai Network Landing Page Redesign',
        completedAt: now - 5 * day, // Current month (Feb/Mar)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('1200000000000000000'),
    },
    {
        tokenId: 2,
        jobTitle: 'Smart Contract Development – DEX Router',
        completedAt: now - 35 * day, // Last month (Jan)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('3500000000000000000'),
    },
    {
        tokenId: 3,
        jobTitle: 'Token Audit Report – Quai Governance',
        completedAt: now - 65 * day, // 2 months ago (Dec)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('2000000000000000000'),
    },
    {
        tokenId: 4,
        jobTitle: 'Marketing Campaign – Q1 Launch',
        completedAt: now - 95 * day, // 3 months ago (Nov)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('4500000000000000000'),
    },
    {
        tokenId: 5,
        jobTitle: 'Documentation Portal Setup',
        completedAt: now - 125 * day, // 4 months ago (Oct)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('800000000000000000'),
    },
    {
        tokenId: 6,
        jobTitle: 'Community Discord Bot',
        completedAt: now - 155 * day, // 5 months ago (Sep)
        client: DEMO_CLIENT_ADDRESS,
        freelancer: DEMO_FREELANCER_ADDRESS,
        amount: BigInt('1500000000000000000'),
    },
]

export const DEMO_PROPOSALS = [
    {
        jobId: 1,
        freelancerAddress: DEMO_FREELANCER_ADDRESS,
        rate: '1.8',
        coverLetter: 'I have 5 years of experience building DeFi dashboards...',
        submittedAt: now - 1 * day,
        status: 'pending' as const,
    },
    {
        jobId: 2,
        freelancerAddress: DEMO_FREELANCER_ADDRESS,
        rate: '1.2',
        coverLetter: "As a Web3 designer with 4 years experience...",
        submittedAt: now - 12 * 3600,
        status: 'pending' as const,
    },
    {
        jobId: 7,
        freelancerAddress: DEMO_FREELANCER_ADDRESS,
        rate: '1.2',
        coverLetter: "Experience editor here, can deliver quickly.",
        submittedAt: now - 9 * day,
        status: 'accepted' as const,
        jobDetails: { status: 'completed' }
    },
]

// localStorage key for user-posted demo jobs
const LS_DEMO_JOBS = 'qw_demo_jobs'

export function getDemoJobs(): typeof DEMO_JOBS {
    try {
        const raw = localStorage.getItem(LS_DEMO_JOBS)
        if (!raw) return DEMO_JOBS
        const extra = JSON.parse(raw).map((j: any) => ({
            ...j,
            id: BigInt(j.id),
            budget: BigInt(j.budget),
            deadline: BigInt(j.deadline),
            createdAt: BigInt(j.createdAt),
            status: BigInt(j.status),
        }))
        return [...DEMO_JOBS, ...extra]
    } catch {
        return DEMO_JOBS
    }
}

export function addDemoJob(job: {
    title: string; description: string; category: string;
    deadline: number; budget: string; client: string
}) {
    try {
        const existing = JSON.parse(localStorage.getItem(LS_DEMO_JOBS) || '[]')
        const newId = DEMO_JOBS.length + existing.length + 1
        const budgetWei = String(Math.floor(parseFloat(job.budget) * 1e18))
        existing.push({
            id: String(newId),
            title: job.title,
            description: job.description,
            category: job.category,
            budget: budgetWei,
            deadline: String(job.deadline),
            createdAt: String(Math.floor(Date.now() / 1000)),
            status: '1',
            client: job.client,
            freelancer: '0x0000000000000000000000000000000000000000',
        })
        localStorage.setItem(LS_DEMO_JOBS, JSON.stringify(existing))
    } catch { }
}
