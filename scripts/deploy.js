const quais = require('quais')
const NFTArtifact = require('../artifacts/contracts/WorkAgreementNFT.sol/WorkAgreementNFT.json')
const EscrowArtifact = require('../artifacts/contracts/JobEscrow.sol/JobEscrow.json')
require('dotenv').config({ path: '.env.local' })

async function main() {
    const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
    const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)

    console.log('Deploying WorkAgreementNFT...')
    const NFTFactory = new quais.ContractFactory(NFTArtifact.abi, NFTArtifact.bytecode, wallet)
    const nft = await NFTFactory.deploy(wallet.address)
    await nft.waitForDeployment()
    const nftAddress = await nft.getAddress()
    console.log('NFT:', nftAddress)

    console.log('Deploying JobEscrow...')
    const EscrowFactory = new quais.ContractFactory(EscrowArtifact.abi, EscrowArtifact.bytecode, wallet)
    const escrow = await EscrowFactory.deploy(nftAddress)
    await escrow.waitForDeployment()
    const escrowAddress = await escrow.getAddress()
    console.log('Escrow:', escrowAddress)

    console.log('\n--- Add to .env.local ---')
    console.log(`NEXT_PUBLIC_JOB_ESCROW_ADDRESS="${escrowAddress}"`)
    console.log(`NEXT_PUBLIC_NFT_ADDRESS="${nftAddress}"`)
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
