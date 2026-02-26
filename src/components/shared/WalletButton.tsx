import { useState, useEffect } from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { shortenAddress, formatQuai } from '@/lib/quai'

export function WalletButton() {
  const { address, isConnected, connect, disconnect, hasPelagus, provider } = useWallet()
  const [balance, setBalance] = useState<string>('0.00')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (provider && address) {
      provider.getBalance(address, 'latest').then((b: bigint) => {
        setBalance(formatQuai(b))
      }).catch(() => { })
    }
  }, [provider, address])

  if (!hasPelagus) {
    return (
      <a href="https://pelaguswallet.io" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ animation: 'borderGlow 1.5s ease-in-out infinite' }}>
        <Wallet size={16} /> Install Pelagus
      </a>
    )
  }

  if (!isConnected) {
    return (
      <button
        className="btn btn-secondary"
        onClick={connect}
        style={{ animation: 'borderGlow 1.5s ease-in-out infinite' }}
      >
        <Wallet size={16} /> Connect Wallet
      </button>
    )
  }

  return (
    <button
      onClick={disconnect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: 'var(--radius-pill)',
        background: 'var(--bg-elevated)',
        border: `1px solid ${isHovered ? 'var(--border-strong)' : 'var(--border-default)'}`,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        transition: 'all var(--transition-base)'
      }}
    >
      {isHovered ? (
        <LogOut size={16} color="var(--error)" />
      ) : (
        <div style={{
          width: 8, height: 8, borderRadius: '50%', background: 'var(--quai-green)',
          animation: 'pulseGreen 2.5s ease-in-out infinite'
        }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="mono">{shortenAddress(address!)}</span>
        <span style={{ color: 'var(--border-strong)' }}>|</span>
        <span className="amount-quai">{balance}</span>
      </div>
    </button>
  )
}
