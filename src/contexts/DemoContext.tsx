import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface DemoContextType {
    isDemo: boolean
    demoAddress: string
    enterDemo: (role: 'client' | 'freelancer') => void
    exitDemo: () => void
    demoRole: 'client' | 'freelancer' | null
}

const DemoContext = createContext<DemoContextType>({
    isDemo: false,
    demoAddress: '',
    enterDemo: () => { },
    exitDemo: () => { },
    demoRole: null,
})

export const DEMO_CLIENT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
export const DEMO_FREELANCER_ADDRESS = '0xA94F5374Fce5edBC8E2a8697C15331677e6EbF0B'

// Persist to localStorage so demo mode survives tab changes and page refreshes
const LS_DEMO = 'qw_demo'
const LS_ROLE = 'qw_demo_role'

export function DemoProvider({ children }: { children: ReactNode }) {
    const [isDemo, setIsDemo] = useState<boolean>(() => localStorage.getItem(LS_DEMO) === 'true')
    const [demoRole, setDemoRole] = useState<'client' | 'freelancer' | null>(
        () => (localStorage.getItem(LS_ROLE) as 'client' | 'freelancer' | null)
    )

    const enterDemo = useCallback((role: 'client' | 'freelancer') => {
        setIsDemo(true)
        setDemoRole(role)
        localStorage.setItem(LS_DEMO, 'true')
        localStorage.setItem(LS_ROLE, role)
    }, [])

    const exitDemo = useCallback(() => {
        setIsDemo(false)
        setDemoRole(null)
        localStorage.removeItem(LS_DEMO)
        localStorage.removeItem(LS_ROLE)
    }, [])

    const demoAddress = demoRole === 'client' ? DEMO_CLIENT_ADDRESS : DEMO_FREELANCER_ADDRESS

    return (
        <DemoContext.Provider value={{ isDemo, demoAddress, enterDemo, exitDemo, demoRole }}>
            {children}
        </DemoContext.Provider>
    )
}

export const useDemo = () => useContext(DemoContext)
