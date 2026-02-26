import { useState, useEffect, useCallback } from 'react'
import { quais } from 'quais'
import { useDemo, DEMO_CLIENT_ADDRESS, DEMO_FREELANCER_ADDRESS } from '@/contexts/DemoContext'

export function useWallet() {
  const { isDemo, demoRole } = useDemo()

  // All hooks called unconditionally (Rules of Hooks)
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<any>(null)
  const [shard, setShard] = useState<string | null>(null)
  const [hasPelagus, setHasPelagus] = useState(false)

  useEffect(() => {
    if (isDemo) return  // skip real wallet init in demo mode
    if (typeof window === 'undefined') return
    const w = window as any
    if (!w.pelagus) {
      setHasPelagus(false)
      return
    }
    setHasPelagus(true)

    let p: any
    try {
      p = new quais.BrowserProvider(w.pelagus)
      setProvider(p)

      p.send('quai_accounts', []).then((accounts: string[]) => {
        if (accounts?.[0]) {
          setAddress(accounts[0])
          try { setShard(quais.getZoneForAddress(accounts[0]) ?? 'Cyprus-1') } catch { }
        }
      }).catch(() => { })
    } catch { }

    const onAccountsChanged = (accounts: string[]) => {
      // Guard against undefined/empty accounts from quais
      if (!accounts?.[0]) {
        setAddress(null)
        setShard(null)
        return
      }
      setAddress(accounts[0])
      try { setShard(quais.getZoneForAddress(accounts[0]) ?? 'Cyprus-1') } catch { }
    }

    try { w.pelagus.on('accountsChanged', onAccountsChanged) } catch { }

    return () => {
      try { w.pelagus.removeListener?.('accountsChanged', onAccountsChanged) } catch { }
    }
  }, [isDemo])

  const connect = useCallback(async () => {
    if (isDemo) return
    const w = window as any
    if (!w.pelagus) { window.open('https://pelaguswallet.io', '_blank'); return }
    try {
      const p = new quais.BrowserProvider(w.pelagus)
      const accounts = await p.send('quai_requestAccounts', [])
      setProvider(p)
      if (accounts?.[0]) {
        setAddress(accounts[0])
        try { setShard(quais.getZoneForAddress(accounts[0]) ?? 'Cyprus-1') } catch { }
      }
    } catch (e) {
      console.error('Wallet connect error:', e)
    }
  }, [isDemo])

  const disconnect = useCallback(() => {
    if (isDemo) return
    setAddress(null); setProvider(null); setShard(null)
  }, [isDemo])

  const getSigner = useCallback(async () => {
    if (isDemo) throw new Error('Demo mode: no signer')
    if (!provider) throw new Error('Not connected')
    return provider.getSigner()
  }, [provider, isDemo])

  // In demo mode, override return values with mock data
  if (isDemo) {
    const demoAddress = demoRole === 'client' ? DEMO_CLIENT_ADDRESS : DEMO_FREELANCER_ADDRESS
    return {
      address: demoAddress,
      provider: null,
      shard: 'Cyprus-1',
      hasPelagus: false,
      isConnected: true,
      connect,
      disconnect,
      getSigner,
    }
  }

  return { address, provider, shard, hasPelagus, isConnected: !!address, connect, disconnect, getSigner }
}
