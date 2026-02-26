import { quais } from 'quais'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const RPC_URL = process.env.VITE_RPC_URL || 'https://orchard.rpc.quai.network'
const PRIV_KEY = process.env.PRIVATE_KEY // User needs to provide this or run via Pelagus
const ESCROW_ADDR = process.env.VITE_JOB_ESCROW_ADDRESS
const NFT_ADDR = process.env.VITE_NFT_ADDRESS

async function main() {
    if (!ESCROW_ADDR || !NFT_ADDR) {
        console.error("Missing ESCROW_ADDR or NFT_ADDR in .env")
        return
    }

    console.log(`Checking ownership for NFT Contract: ${NFT_ADDR}`)
    console.log(`Target Owner (Escrow): ${ESCROW_ADDR}`)

    const provider = new quais.JsonRpcProvider(RPC_URL)
    const nftABI = [
        "function owner() view returns (address)",
        "function transferOwnership(address newOwner) external"
    ]

    const nftContract = new quais.Contract(NFT_ADDR, nftABI, provider)

    try {
        const currentOwner = await nftContract.owner()
        console.log(`Current Owner: ${currentOwner}`)

        if (currentOwner.toLowerCase() === ESCROW_ADDR.toLowerCase()) {
            console.log("✅ Ownership is already correct!")
            return
        }

        console.log("❌ Ownership mismatch detected!")
        console.log(`Action Required: Transfer ownership of NFT contract (${NFT_ADDR}) to Escrow contract (${ESCROW_ADDR})`)
        console.log("\nYou should do this via your deployment script or a Pelagus transaction.")
        console.log("If you have the owner private key in .env, I can try to do it now...")

        if (PRIV_KEY) {
            const wallet = new quais.Wallet(PRIV_KEY, provider)
            const nftWithSigner = nftContract.connect(wallet)
            console.log("Attempting transfer...")
            const tx = await nftWithSigner.transferOwnership(ESCROW_ADDR)
            console.log("Transaction sent:", tx.hash)
            await tx.wait()
            console.log("✅ Ownership transferred successfully!")
        } else {
            console.log("Skipping automated transfer (no PRIVATE_KEY found in .env)")
        }

    } catch (e) {
        console.error("Error during check:", e.message)
    }
}

main().catch(console.error)
