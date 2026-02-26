# WorQu

A decentralized freelance marketplace built on the Quai Network blockchain. WorQu enables clients to post jobs and freelancers to submit proposals, with payments secured through smart contracts and work agreements tracked as NFTs.

## Features

### For Clients
- **Post Jobs**: Create job listings with title, description, category, budget (in QUAI), and deadline
- **Browse Freelancers**: View freelancer profiles with skills, experience, and portfolio
- **Accept Proposals**: Review and accept proposals from qualified freelancers
- **Secure Escrow**: Funds are locked in smart contracts until work is approved
- **Release Payment**: Approve completed work and release payment to freelancers
- **Rate & Review**: Leave ratings and reviews for freelancers after job completion
- **Dispute Resolution**: Raise disputes if needed

### For Freelancers
- **Browse Jobs**: Discover available jobs with AI-powered skill matching
- **Submit Proposals**: Send proposals with custom rates and cover letters
- **Track Contracts**: Monitor active contracts and deliverables
- **Portfolio NFTs**: Completed work is minted as NFTs for your portfolio
- **Profile Management**: Build your profile with skills, experience, and links
- **AI Skill Detection**: Automatically detect skills from GitHub/LinkedIn profiles

### Platform Features
- **Wallet Integration**: Connect via Pelagus wallet for Quai Network
- **Real-time Updates**: Live job status tracking and notifications
- **Energy Transparency**: View costs in QUAI, Qi, and kWh equivalents
- **Zero Platform Fees**: No middleman fees, only minimal blockchain transaction costs

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Three.js + React Three Fiber** - 3D graphics
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization

### Blockchain
- **Quais.js v1** - Quai Network SDK
- **Solidity 0.8.20** - Smart contracts
- **Hardhat** - Contract development and deployment
- **Pelagus Wallet** - Browser extension for transaction signing

### Backend/Database
- **Supabase** - PostgreSQL database for off-chain data

## Prerequisites

- Node.js 16+ and npm
- [Pelagus Wallet](https://pelaguswallet.io) browser extension
- Quai Network testnet tokens (for deployment)

## Smart Contracts

### JobEscrow.sol
Main contract managing the job lifecycle:

- `postJob()` - Client posts job with budget (funds locked in contract)
- `acceptProposal()` - Client accepts freelancer and mints NFT agreement
- `releasePayment()` - Client releases funds to freelancer upon completion
- `markJobDelivered()` - Freelancer marks work as delivered
- `raiseDispute()` - Client can dispute active jobs
- `refund()` - Client can refund if deadline passes without hiring

**Job Statuses**: Open → Funded → Active → Completed/Disputed/Refunded

### WorkAgreementNFT.sol
ERC-721 contract for work agreements:

- `mintAgreement()` - Creates NFT when proposal is accepted (minted to freelancer)
- `updateStatus()` - Updates agreement status throughout job lifecycle
- Stores metadata: client, freelancer, jobId, amount, status, timestamp
- Serves as proof of completed work for freelancer portfolios

## Architecture

### Data Flow
1. **On-chain data** (jobs, payments, contracts) → Quai blockchain via quais.js
2. **Off-chain data** (profiles, proposals, ratings) → Supabase PostgreSQL
3. **Hybrid approach**: Blockchain is source of truth for jobs/payments, Supabase stores metadata

### Custom Hooks
- `useWallet()` - Manages wallet connection, Pelagus integration, demo mode
- `useContracts()` - Reads/writes to JobEscrow and NFT contracts
- `useProfile()` - Manages freelancer profiles (localStorage + Supabase)
- `useProposals()` - Manages job proposals (Supabase)

### State Management
- React Context API for global state (DemoContext, ThemeContext)
- localStorage for persistence (profiles, proposals, demo mode)
- Supabase for server-side data synchronization

## Project Structure

```
worqu/
├── contracts/              # Solidity smart contracts
│   ├── JobEscrow.sol
│   └── WorkAgreementNFT.sol
├── scripts/                # Deployment scripts
│   └── deploy.js
├── abi/                    # Contract ABIs
├── src/
│   ├── components/         # React components
│   │   ├── client/        # Client-specific components
│   │   ├── freelancer/    # Freelancer-specific components
│   │   ├── landing/       # Landing page components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # UI primitives
│   ├── contexts/          # React contexts
│   │   ├── DemoContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useWallet.ts
│   │   ├── useContracts.ts
│   │   ├── useProfile.ts
│   │   └── useProposals.ts
│   ├── lib/               # Utility libraries
│   │   ├── quai.ts       # Quai Network utilities
│   │   ├── supabase.ts   # Supabase client
│   │   └── demoData.ts   # Demo mode data
│   ├── pages/             # Page components
│   │   ├── client/       # Client portal pages
│   │   ├── freelancer/   # Freelancer portal pages
│   │   └── shared/       # Shared pages
│   ├── layouts/           # Layout components
│   └── App.tsx            # Main app component
├── public/                # Static assets
├── hardhat.config.js      # Hardhat configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

## Security Features

- **Address Validation**: All addresses validated in smart contracts
- **Escrow Protection**: Funds locked until work is approved
- **Automatic Refunds**: Clients can refund if deadline passes without hiring

## Key Features Explained

### AI-Powered Job Matching
Freelancers with complete profiles get AI-powered job recommendations based on their skills. The system analyzes job descriptions and matches them against freelancer skills to provide a match score.

### Energy Transparency
All costs are displayed in multiple formats:
- **QUAI**: Native token amount
- **Qi**: Energy-backed unit
- **kWh**: Kilowatt-hour equivalent

This transparency helps users understand the real energy cost of transactions.

### NFT Portfolio
Every completed job is minted as an NFT and transferred to the freelancer. This creates an immutable, verifiable portfolio of work that freelancers can showcase.

### Zero Platform Fees
Unlike traditional platforms (Upwork charges 20%), QuaiWork charges zero platform fees. Users only pay minimal blockchain transaction costs (~$0.001).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [Quai Network](https://qu.ai)
- [Pelagus Wallet](https://pelaguswallet.io)
- [Quai Documentation](https://docs.qu.ai)
- [Supabase](https://supabase.com)
- [Website Demo Link]()
- [Demonstration Video]()

## Support

For questions or issues:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Join the Quai Network community for blockchain-specific questions

---

Built on Quai Network
