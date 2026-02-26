import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { }
})

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('qw_theme')
        if (saved === 'light' || saved === 'dark') return saved
        return 'dark'
    })

    useEffect(() => {
        // Apply theme to <html> so CSS [data-theme="light"] selector works
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('qw_theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme(t => t === 'dark' ? 'light' : 'dark')
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
