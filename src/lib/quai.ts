import { quais } from 'quais'

export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://orchard.rpc.quai.network'
export const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL || 'https://orchard.quaiscan.io'
export const ESCROW_ADDR = import.meta.env.VITE_JOB_ESCROW_ADDRESS || '0x0000000000000000000000000000000000000000'
export const NFT_ADDR = import.meta.env.VITE_NFT_ADDRESS || '0x0000000000000000000000000000000000000000'

export const getRpcProvider = () =>
  new quais.JsonRpcProvider(RPC_URL)

export const getWeb3Provider = () =>
  typeof window !== 'undefined' && (window as any).pelagus
    ? new quais.BrowserProvider((window as any).pelagus)
    : null

export const formatQuai = (val: bigint | string | number): string => {
  if (val === undefined || val === null) return '0.0000'
  try {
    const s = String(val)
    // If it's a large integer (Wei), it won't have a decimal and will be long
    // Increase robustness: if it's strictly digits and long, treat as Wei
    const isStrictInt = /^\d+$/.test(s)
    if (isStrictInt && s.length > 10) {
      return parseFloat(quais.formatQuai(BigInt(s))).toFixed(4)
    }
    // If it's already a float or small integer string/number, it's likely already in QUAI
    const n = parseFloat(s)
    if (!isNaN(n)) return n.toFixed(4)
    return '0.0000'
  } catch (e) {
    return '0.0000'
  }
}

export const parseQuai = (val: string): bigint => {
  try {
    return quais.parseQuai(val)
  } catch (e) {
    console.error('parseQuai error:', e)
    return 0n
  }
}

export const shortenAddress = (addr: string): string =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export const txUrl = (hash: string) => `${EXPLORER_URL}/tx/${hash}`
export const addrUrl = (addr: string) => `${EXPLORER_URL}/address/${addr}`
export const tokenUrl = (addr: string) => `${EXPLORER_URL}/token/${addr}`

// Qi/kWh conversions — approximate for demo
export const quaiToQi = (quai: number): number => quai * 0.15
export const qiToKwh = (qi: number): number => qi / 0.16

export const formatDate = (ts: number): string =>
  new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const timeAgo = (ts: number): string => {
  const diff = Date.now() / 1000 - ts
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export const countdown = (deadline: number): string => {
  const diff = deadline - Date.now() / 1000
  if (diff <= 0) return 'Expired'
  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
