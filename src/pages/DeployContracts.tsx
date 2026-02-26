import { useState } from 'react'
import { quais } from 'quais'
import { useWallet } from '@/hooks/useWallet'
import toast from 'react-hot-toast'

export function DeployContracts() {
    const { address, isConnected, getSigner } = useWallet()
    const [isDeploying, setIsDeploying] = useState(false)
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(prev => [...prev, msg])

    const handleDeploy = async () => {
        const w = window as any
        if (!w.pelagus) {
            toast.error('Pelagus wallet not found')
            return
        }

        setIsDeploying(true)
        setLogs([])
        addLog('📥 Fetching compiled contract artifacts...')

        try {
            const nftRes = await fetch('/artifacts/WorkAgreementNFT.json')
            const escrowRes = await fetch('/artifacts/JobEscrow.json')

            const nftArtifact = await nftRes.json()
            const escrowArtifact = await escrowRes.json()

            if (!nftArtifact.bytecode || !escrowArtifact.bytecode) {
                throw new Error('Contract bytecode missing in artifacts. Please run compilation first.')
            }

            addLog('🚀 Getting signer...')
            const signer = await getSigner()
            const userAddr = await signer.getAddress()

            // Quai v1 requires metadata in deployment. 
            // NOTE: In quais v1, IPFSHash is passed to the ContractFactory constructor, not the deploy method.
            const DUMMY_METADATA_HASH = 'QmUNLL0000000000000000000000000000000000000000'

            addLog('🚀 Deploying WorkAgreementNFT...')
            // Pass metadata hash as the 4th argument to ContractFactory
            const nftFactory = new quais.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, signer, DUMMY_METADATA_HASH)
            const nft = await nftFactory.deploy(userAddr)

            addLog('⏳ Waiting for NFT deployment confirmation...')
            await nft.waitForDeployment()
            const nftAddress = await nft.getAddress()
            addLog(`✅ NFT Deployed at: ${nftAddress}`)

            addLog('\n🚀 Deploying JobEscrow...')
            // Pass metadata hash as the 4th argument to ContractFactory
            const escrowFactory = new quais.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, signer, DUMMY_METADATA_HASH)
            const escrow = await escrowFactory.deploy(nftAddress)

            addLog('⏳ Waiting for Escrow deployment confirmation...')
            await escrow.waitForDeployment()
            const escrowAddress = await escrow.getAddress()
            addLog(`✅ Escrow Deployed at: ${escrowAddress}`)

            addLog('\n🔐 Granting JobEscrow ownership of NFT contract...')
            const tx = await (nft as any).transferOwnership(escrowAddress)
            await tx.wait()
            addLog('✅ Ownership transferred successfully')

            addLog('\n🎉 SUCCESS! Copy these lines to your .env file:')
            addLog('================================================================')
            addLog(`VITE_NFT_ADDRESS="${nftAddress}"`)
            addLog(`VITE_JOB_ESCROW_ADDRESS="${escrowAddress}"`)
            addLog('================================================================')

            toast.success('Contracts deployed successfully!')
        } catch (error: any) {
            console.error(error)
            addLog(`\n❌ Error: ${error.message}`)
            toast.error('Deployment failed')
        } finally {
            setIsDeploying(false)
        }
    }

    return (
        <div className="container mx-auto p-10 max-w-2xl bg-slate-900 text-white rounded-xl shadow-2xl mt-12 border border-slate-800">
            <h1 className="text-3xl font-bold text-green-400 mb-6">Deploy Quai Contracts</h1>
            <p className="text-slate-400 mb-8">
                This utility helps you deploy the WorkAgreementNFT and JobEscrow contracts directly to Quai Network using your connected Pelagus wallet.
            </p>

            {!isConnected ? (
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
                    <p className="mb-4 text-slate-300">Please connect your Pelagus wallet to begin.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="p-4 bg-slate-800 rounded border border-slate-700 flex justify-between items-center">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Connected Wallet</div>
                            <div className="font-mono text-sm text-green-500">{address}</div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase">
                            Connected
                        </div>
                    </div>

                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${isDeploying
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-500 text-white shadow-lg active:transform active:scale-95'
                            }`}
                    >
                        {isDeploying ? 'Deploying...' : 'Deploy Contracts'}
                    </button>

                    <div className="mt-8">
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Deployment Logs</h3>
                        <div className="bg-black p-6 rounded-lg border border-slate-800 font-mono text-xs overflow-y-auto max-h-96 min-h-[200px] text-green-400 leading-relaxed whitespace-pre-wrap">
                            {logs.length === 0 ? '> Ready for deployment' : logs.map((log, i) => (
                                <div key={i} className="mb-1">{log}</div>
                            ))}
                            {isDeploying && <div className="animate-pulse">_</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
