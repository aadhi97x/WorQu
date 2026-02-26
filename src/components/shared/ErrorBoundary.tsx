import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                    background: 'var(--bg-base)',
                    color: 'var(--text-primary)',
                    textAlign: 'center'
                }}>
                    <div className="glass-card" style={{ padding: 48, maxWidth: 500 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 20,
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ef4444', marginBottom: 24, margin: '0 auto 24px'
                        }}>
                            <AlertTriangle size={40} />
                        </div>

                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Interface Error</h1>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
                            A rendering error occurred in this view. This is likely due to a temporary data inconsistency.
                            {this.state.error && (
                                <div style={{
                                    marginTop: 16, padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                    borderRadius: 8, fontSize: 12, fontFamily: 'var(--font-mono)',
                                    textAlign: 'left', overflowX: 'auto', border: '1px solid var(--border-subtle)'
                                }}>
                                    {this.state.error.message}
                                </div>
                            )}
                        </p>

                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                <RefreshCw size={16} /> Reload Page
                            </button>
                            <a
                                href="/"
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                            >
                                <Home size={16} /> Go Home
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
