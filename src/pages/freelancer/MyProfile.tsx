import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Github, Linkedin, Brain, CheckCircle, RefreshCcw, Loader2,
    Camera, Plus, X, Globe, FileText, Briefcase, MapPin,
    DollarSign, Star, ChevronDown, Save, User
} from 'lucide-react'
import { useProfile, DEFAULT_PROFILE, FreelancerProfile } from '@/hooks/useProfile'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'

const SKILL_SUGGESTIONS = [
    'React', 'TypeScript', 'Solidity', 'Node.js', 'Python', 'Rust', 'Go',
    'Next.js', 'Vue.js', 'Web3.js', 'Ethers.js', 'Hardhat', 'Foundry',
    'Smart Contracts', 'DeFi', 'NFT', 'IPFS', 'GraphQL', 'PostgreSQL',
    'Docker', 'AWS', 'Figma', 'UI/UX', 'Product Design', 'Auditing',
]

const EXPERIENCE_LEVELS = ['Junior', 'Mid', 'Senior', 'Expert'] as const
const AVAILABILITY_OPTIONS = ['Full-time', 'Part-time', 'Contract'] as const

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="glass-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--quai-green)' }}>{icon}</div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {children}
            </div>
        </div>
    )
}

function Field({ label, hint, children }: { label: string, hint?: string, children: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</label>
            {children}
            {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{hint}</div>}
        </div>
    )
}

function Input({ value, onChange, placeholder, type = 'text' }: any) {
    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="input"
            style={{ fontSize: 14 }}
        />
    )
}

export function MyProfile() {
    const { profile, saveProfile, analyzeProfile, loadingProfile } = useProfile()
    const { address, isConnected } = useWallet()
    const { getFreelancerRating } = useContracts()

    // Local form state (controlled)
    const [form, setForm] = useState<FreelancerProfile>({ ...DEFAULT_PROFILE })
    const [skillInput, setSkillInput] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ratingInfo, setRatingInfo] = useState({ average: 0, count: 0, reviews: [] as any[] })

    // Sync from profile when loaded
    useEffect(() => {
        setForm({ ...DEFAULT_PROFILE, ...profile })
        setAvatarPreview(profile.avatarUrl || '')
    }, [profile])

    useEffect(() => {
        if (address) {
            getFreelancerRating(address).then(setRatingInfo)
        }
    }, [address, getFreelancerRating])

    const set = (key: keyof FreelancerProfile) => (val: any) =>
        setForm(f => ({ ...f, [key]: val }))

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string
            setAvatarPreview(dataUrl)
            setForm(f => ({ ...f, avatarUrl: dataUrl }))
        }
        reader.readAsDataURL(file)
    }

    const addSkill = (skill: string) => {
        const s = skill.trim()
        if (!s || form.skills.includes(s)) return
        setForm(f => ({ ...f, skills: [...f.skills, s] }))
        setSkillInput('')
    }

    const removeSkill = (skill: string) =>
        setForm(f => ({ ...f, skills: f.skills.filter(x => x !== skill) }))

    const handleSave = async () => {
        setSaving(true)
        await saveProfile(form)
        setSaving(false)
    }

    const handleAnalyze = async () => {
        if (!form.githubUrl && !form.linkedinUrl) return
        setIsAnalyzing(true)
        const updated = await analyzeProfile(form.githubUrl, form.linkedinUrl)
        setForm(f => ({ ...f, ...updated }))
        setIsAnalyzing(false)
    }

    const profileCompletion = (() => {
        const fields = [form.name, form.bio, form.avatarUrl, form.githubUrl, form.title, form.hourlyRate, form.skills.length > 0]
        return Math.round((fields.filter(Boolean).length / fields.length) * 100)
    })()

    if (!isConnected) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center', padding: '0 24px' }}>
                <div style={{ fontSize: 48 }}>👤</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>Connect to set up your profile</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>Your profile is stored on-chain linked to your wallet address.</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '28px 40px 80px', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Profile</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                        Your profile is visible to clients when they review your proposals.
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                    {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Profile</>}
                </button>
            </motion.div>

            {/* Completion bar */}
            <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', flexShrink: 0 }}>Profile strength</div>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${profileCompletion}%`, background: profileCompletion >= 80 ? 'var(--quai-green)' : profileCompletion >= 50 ? '#f97316' : '#ef4444', borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--quai-green)', flexShrink: 0 }}>{profileCompletion}%</div>
                {profileCompletion < 100 && <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>Add more details to get more visibility</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'flex-start' }}>
                {/* ── Left: Avatar + quick identity ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Avatar */}
                    <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: 110, height: 110, borderRadius: '50%',
                                background: avatarPreview ? 'transparent' : 'var(--quai-green-10)',
                                border: '2px solid var(--quai-green-dim)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', flexShrink: 0
                            }}>
                                {avatarPreview
                                    ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <User size={40} color="var(--quai-green)" />
                                }
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    position: 'absolute', bottom: 0, right: 0,
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: 'var(--quai-green)', border: '2px solid var(--bg-surface)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#000'
                                }}
                            >
                                <Camera size={14} />
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{form.name || 'Your Name'}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{form.title || 'Your title'}</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 6, opacity: 0.7 }}>
                                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '—'}
                            </div>
                        </div>
                        {form.hourlyRate && (
                            <div style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-pill)', padding: '4px 14px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--quai-green)', fontWeight: 700 }}>
                                {form.hourlyRate} QUAI/hr
                            </div>
                        )}
                    </div>

                    {/* Quick stats preview */}
                    {(form.experienceLevel || form.availability || form.location || ratingInfo.count > 0) && (
                        <div className="glass-card" style={{ padding: 20 }}>
                            <div className="section-label" style={{ marginBottom: 12 }}>PROFILE PREVIEW</div>
                            {ratingInfo.count > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                    <Star size={13} color="var(--quai-green)" /> {ratingInfo.average.toFixed(1)} Rating ({ratingInfo.count} reviews)
                                </div>
                            )}
                            {form.experienceLevel && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                    <Star size={13} color="var(--text-muted)" /> {form.experienceLevel} Level
                                </div>
                            )}
                            {form.availability && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                    <Briefcase size={13} color="var(--text-muted)" /> {form.availability}
                                </div>
                            )}
                            {form.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                    <MapPin size={13} color="var(--text-muted)" /> {form.location}
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI skills preview */}
                    {form.isAnalyzed && form.aiSkills.length > 0 && (
                        <div className="glass-card" style={{ padding: 20, border: '1px solid var(--quai-green-dim)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                                <CheckCircle size={14} color="var(--quai-green)" />
                                <div className="section-label" style={{ margin: 0, color: 'var(--quai-green)' }}>AI VERIFIED</div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {form.aiSkills.map(s => (
                                    <span key={s} style={{ background: 'var(--quai-green-10)', color: 'var(--quai-green)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-pill)', padding: '2px 8px', fontSize: 11, fontFamily: 'var(--font-mono)' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right: Full form ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Basic Info */}
                    <Section title="Basic Information" icon={<User size={16} />}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Full Name" hint="Shown to clients on your proposals">
                                <Input value={form.name} onChange={set('name')} placeholder="Jane Smith" />
                            </Field>
                            <Field label="Professional Title" hint="e.g. Full-Stack Web3 Developer">
                                <Input value={form.title} onChange={set('title')} placeholder="Smart Contract Engineer" />
                            </Field>
                        </div>
                        <Field label="Bio / Summary" hint="Describe your expertise, what you build, and what you're looking for (max 500 chars)">
                            <textarea
                                className="input"
                                value={form.bio}
                                onChange={e => set('bio')(e.target.value)}
                                placeholder="I'm a Web3 developer with 4 years of experience building DeFi protocols and NFT platforms. I specialize in Solidity and TypeScript..."
                                style={{ minHeight: 120, resize: 'vertical', fontSize: 14, lineHeight: 1.7 }}
                                maxLength={500}
                            />
                            <div style={{ fontSize: 11, color: form.bio.length > 450 ? '#f97316' : 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                                {form.bio.length} / 500
                            </div>
                        </Field>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Location">
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                    <input value={form.location} onChange={e => set('location')(e.target.value)} placeholder="New York, USA" className="input" style={{ paddingLeft: 34 }} />
                                </div>
                            </Field>
                            <Field label="Hourly Rate (QUAI)">
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                    <input type="number" value={form.hourlyRate} onChange={e => set('hourlyRate')(e.target.value)} placeholder="0.5" className="input" style={{ paddingLeft: 34, fontFamily: 'var(--font-mono)' }} step="0.01" min="0" />
                                </div>
                            </Field>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <Field label="Experience Level">
                                <select
                                    value={form.experienceLevel}
                                    onChange={e => set('experienceLevel')(e.target.value as any)}
                                    className="input"
                                    style={{ fontSize: 14, cursor: 'pointer' }}
                                >
                                    <option value="">Select level...</option>
                                    {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </Field>
                            <Field label="Availability">
                                <select
                                    value={form.availability}
                                    onChange={e => set('availability')(e.target.value as any)}
                                    className="input"
                                    style={{ fontSize: 14, cursor: 'pointer' }}
                                >
                                    <option value="">Select availability...</option>
                                    {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </Field>
                        </div>
                    </Section>

                    {/* Links */}
                    <Section title="Links & Portfolio" icon={<Globe size={16} />}>
                        <Field label="GitHub Profile URL">
                            <div style={{ position: 'relative' }}>
                                <Github size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input value={form.githubUrl} onChange={e => set('githubUrl')(e.target.value)} placeholder="https://github.com/username" className="input" style={{ paddingLeft: 34 }} />
                            </div>
                        </Field>
                        <Field label="LinkedIn Profile URL">
                            <div style={{ position: 'relative' }}>
                                <Linkedin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input value={form.linkedinUrl} onChange={e => set('linkedinUrl')(e.target.value)} placeholder="https://linkedin.com/in/username" className="input" style={{ paddingLeft: 34 }} />
                            </div>
                        </Field>
                        <Field label="Portfolio / Website URL">
                            <div style={{ position: 'relative' }}>
                                <Globe size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input value={form.portfolioUrl} onChange={e => set('portfolioUrl')(e.target.value)} placeholder="https://yoursite.com" className="input" style={{ paddingLeft: 34 }} />
                            </div>
                        </Field>
                        <Field label="Resume / CV URL" hint="Link to a Google Drive, Notion page, or PDF URL (direct link)">
                            <div style={{ position: 'relative' }}>
                                <FileText size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input value={form.resumeUrl} onChange={e => set('resumeUrl')(e.target.value)} placeholder="https://drive.google.com/..." className="input" style={{ paddingLeft: 34 }} />
                            </div>
                        </Field>
                    </Section>

                    {/* Skills */}
                    <Section title="Skills" icon={<Star size={16} />}>
                        <Field label="Add Skills" hint="Type a skill and press Enter or click a suggestion">
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    className="input"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                                    placeholder="e.g. Solidity, React, Rust..."
                                    style={{ flex: 1 }}
                                />
                                <button onClick={() => addSkill(skillInput)} className="btn-secondary" style={{ padding: '0 16px', flexShrink: 0 }}>
                                    <Plus size={15} />
                                </button>
                            </div>
                        </Field>

                        {/* Added skills */}
                        {form.skills.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {form.skills.map(s => (
                                    <span key={s} style={{
                                        background: 'var(--quai-green-10)', color: 'var(--quai-green)',
                                        border: '1px solid var(--quai-green-dim)',
                                        borderRadius: 'var(--radius-pill)', padding: '5px 10px',
                                        fontFamily: 'var(--font-mono)', fontSize: 12,
                                        display: 'flex', alignItems: 'center', gap: 6
                                    }}>
                                        {s}
                                        <X size={11} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeSkill(s)} />
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Suggestions */}
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Suggestions</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 16).map(s => (
                                    <button key={s} onClick={() => addSkill(s)} style={{
                                        background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                                        borderRadius: 'var(--radius-pill)', padding: '4px 10px',
                                        fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer',
                                        fontFamily: 'var(--font-mono)', transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--quai-green-dim)'; e.currentTarget.style.color = 'var(--quai-green)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                                    >+ {s}</button>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* AI Analysis */}
                    <Section title="AI Skill Verification" icon={<Brain size={16} />}>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                            Connect your GitHub and LinkedIn so our AI can automatically verify your skills. Verified skills boost your visibility to clients and improve match scores.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                className="btn-primary"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (!form.githubUrl && !form.linkedinUrl)}
                                style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
                            >
                                {isAnalyzing
                                    ? <><Loader2 size={15} className="animate-spin" /> Analyzing profiles...</>
                                    : <><Brain size={15} /> Analyze & Verify Skills</>
                                }
                            </button>
                            {form.isAnalyzed && (
                                <button
                                    onClick={() => setForm(f => ({ ...f, isAnalyzed: false, aiSkills: [] }))}
                                    className="btn-secondary"
                                    style={{ padding: '0 16px' }}
                                    title="Clear AI results"
                                >
                                    <RefreshCcw size={15} />
                                </button>
                            )}
                        </div>

                        {/* AI Results */}
                        <AnimatePresence>
                            {form.isAnalyzed && !isAnalyzing && form.aiSkills.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: 20, overflow: 'hidden' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <CheckCircle size={16} color="var(--quai-green)" />
                                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--quai-green)' }}>AI Verified Skills</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {form.aiSkills.map(s => (
                                            <span key={s} style={{
                                                background: 'rgba(78,255,160,0.1)', color: 'var(--quai-green)',
                                                border: '1px solid rgba(78,255,160,0.25)',
                                                borderRadius: 'var(--radius-pill)', padding: '4px 10px',
                                                fontFamily: 'var(--font-mono)', fontSize: 12
                                            }}>{s}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Section>

                    {/* Save button (bottom) */}
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', fontSize: 15 }}
                    >
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
                    </button>
                </div>
            </div>
        </div>
    )
}
