import { useState, useEffect, useCallback } from 'react'
import { useWallet } from './useWallet'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export interface FreelancerProfile {
    // Identity
    name: string
    bio: string
    avatarUrl: string   // uploaded URL or data-url
    // Links
    githubUrl: string
    linkedinUrl: string
    portfolioUrl: string
    resumeUrl: string   // URL or file name
    // Professional
    title: string       // e.g. "Full-Stack Web3 Developer"
    hourlyRate: string  // in QUAI
    experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Expert' | ''
    availability: 'Full-time' | 'Part-time' | 'Contract' | ''
    location: string
    // Skills
    skills: string[]    // manually added
    // AI
    isAnalyzed: boolean
    aiSkills: string[]
}

export const DEFAULT_PROFILE: FreelancerProfile = {
    name: '',
    bio: '',
    avatarUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    title: '',
    hourlyRate: '',
    experienceLevel: '',
    availability: '',
    location: '',
    skills: [],
    isAnalyzed: false,
    aiSkills: [],
}

const LS_KEY = (addr: string) => `quaiwork_profile_${addr.toLowerCase()}`

export function useProfile() {
    const { address } = useWallet()
    const [profile, setProfile] = useState<FreelancerProfile>(DEFAULT_PROFILE)
    const [loadingProfile, setLoadingProfile] = useState(false)

    useEffect(() => {
        if (!address) { setProfile(DEFAULT_PROFILE); return }

        // 1. Load from localStorage immediately (fast)
        const local = localStorage.getItem(LS_KEY(address))
        if (local) {
            try { setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(local) }) } catch { }
        }

        // 2. Try Supabase in background
        const fetchProfile = async () => {
            setLoadingProfile(true)
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('wallet_address', address.toLowerCase())
                    .maybeSingle()

                if (data) {
                    const loaded: FreelancerProfile = {
                        name: data.name || '',
                        bio: data.bio || '',
                        avatarUrl: data.avatar_url || '',
                        githubUrl: data.github_url || '',
                        linkedinUrl: data.linkedin_url || '',
                        portfolioUrl: data.portfolio_url || '',
                        resumeUrl: data.resume_url || '',
                        title: data.title || '',
                        hourlyRate: data.hourly_rate?.toString() || '',
                        experienceLevel: data.experience_level || '',
                        availability: data.availability || '',
                        location: data.location || '',
                        skills: data.skills || [],
                        isAnalyzed: data.is_analyzed || false,
                        aiSkills: data.ai_skills || [],
                    }
                    setProfile(loaded)
                    localStorage.setItem(LS_KEY(address), JSON.stringify(loaded))
                }
            } catch { /* Supabase unavailable – local data already set */ }
            finally { setLoadingProfile(false) }
        }

        fetchProfile()
    }, [address])

    const saveProfile = useCallback(async (newProfile: FreelancerProfile) => {
        if (!address) return

        // 1. Save locally first
        setProfile(newProfile)
        localStorage.setItem(LS_KEY(address), JSON.stringify(newProfile))

        // 2. Sync to Supabase
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    wallet_address: address.toLowerCase(),
                    user_type: 'freelancer',
                    name: newProfile.name,
                    bio: newProfile.bio,
                    avatar_url: newProfile.avatarUrl,
                    github_url: newProfile.githubUrl,
                    linkedin_url: newProfile.linkedinUrl,
                    portfolio_url: newProfile.portfolioUrl,
                    resume_url: newProfile.resumeUrl,
                    title: newProfile.title,
                    hourly_rate: newProfile.hourlyRate ? Number(newProfile.hourlyRate) : null,
                    experience_level: newProfile.experienceLevel,
                    availability: newProfile.availability,
                    location: newProfile.location,
                    skills: newProfile.skills,
                    is_analyzed: newProfile.isAnalyzed,
                    ai_skills: newProfile.aiSkills,
                }, { onConflict: 'wallet_address' })

            if (error) console.warn('Silent Supabase profile sync warning:', error)
        } catch {
            console.warn('Supabase unavailable, profile saved locally only')
            toast.error('Network error. Profile saved locally only.')
        }

        toast.success('Profile saved!')
    }, [address])

    const analyzeProfile = useCallback(async (github: string, linkedin: string) => {
        return new Promise<FreelancerProfile>((resolve) => {
            setTimeout(async () => {
                let detected: string[] = []
                if (github.length > 5) detected.push('Solidity', 'Smart Contracts', 'Web3', 'Blockchain', 'Foundry')
                if (linkedin.length > 5) detected.push('React', 'TypeScript', 'Node.js', 'Frontend', 'API Design')
                if (detected.length === 0) detected = ['React', 'Solidity', 'Foundry']
                detected = Array.from(new Set(detected))

                const updated: FreelancerProfile = {
                    ...profile,
                    githubUrl: github,
                    linkedinUrl: linkedin,
                    isAnalyzed: true,
                    aiSkills: detected,
                }
                await saveProfile(updated)
                resolve(updated)
            }, 2500)
        })
    }, [profile, saveProfile])

    return { profile, saveProfile, analyzeProfile, loadingProfile }
}
