import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, CheckCircle, ShieldCheck, AlertTriangle, Lock, Calendar } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { useContracts } from '@/hooks/useContracts'
import { QuaiAmount } from '@/components/shared/QuaiAmount'
import { Modal } from '@/components/shared/Modal'
import { JobListingCard } from '@/components/freelancer/JobListingCard'
import { formatQuai, quaiToQi, qiToKwh } from '@/lib/quai'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'

const JOB_CATEGORIES = [
  { id: 'Development', label: 'Development' },
  { id: 'Design', label: 'Design' },
  { id: 'Writing', label: 'Writing' },
  { id: 'Mobile', label: 'Mobile' },
  { id: 'Web3', label: 'Web3' },
  { id: 'Data', label: 'Data' },
  { id: 'Marketing', label: 'Marketing' },
  { id: 'Video', label: 'Video' },
]

export function PostJob() {
  const { isConnected } = useWallet()
  const { postJob } = useContracts()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Development')
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [experience, setExperience] = useState('Intermediate')
  const [budgetType, setBudgetType] = useState('Fixed Price')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isPosting, setIsPosting] = useState(false)

  const numBudget = parseFloat(budget) || 0
  const qi = quaiToQi(numBudget)
  const kwh = qiToKwh(qi)

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim() && skills.length < 10) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handlePostJob = async () => {
    if (!isConnected) return
    setIsPosting(true)
    try {
      const endOfDay = new Date(deadline!)
      endOfDay.setHours(23, 59, 59, 999)
      const deadlineTs = Math.floor(endOfDay.getTime() / 1000)

      await postJob(title, description, category, deadlineTs, budget)
      toast.success('Job posted successfully!')
      navigate('/client/my-jobs')
    } catch (e: any) {
      toast.error('Failed to post job: ' + (e?.message || e))
      console.error(e)
    } finally {
      setIsPosting(false)
      setIsConfirming(false)
    }
  }

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>JOB TITLE</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            style={{
              width: '100%',
              background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={e => { e.target.style.borderColor = 'var(--quai-green)'; e.target.style.boxShadow = '0 0 0 2px var(--quai-green-10)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none' }}
            maxLength={100}
            placeholder="e.g. Build a decentralized marketplace"
          />
          <span style={{ position: 'absolute', right: 14, top: 12, fontSize: 11, fontFamily: 'var(--font-mono)', color: title.length >= 90 ? 'var(--warning)' : title.length === 100 ? 'var(--error)' : 'var(--text-secondary)' }}>
            {title.length} / 100
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Be specific. Clear titles attract better proposals.</div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>CATEGORY</label>
        <div style={{ position: 'relative' }}>
          <div
            className="input"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', userSelect: 'none',
              background: 'var(--bg-surface)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              borderColor: isCategoryOpen ? 'var(--quai-green)' : 'var(--border-default)',
              boxShadow: isCategoryOpen ? '0 0 0 3px var(--quai-green-10)' : 'none'
            }}
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <span style={{ color: category ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {JOB_CATEGORIES.find(c => c.id === category)?.label || 'Select a category...'}
            </span>
            <ChevronDown size={16} color="var(--text-muted)" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {isCategoryOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)', padding: '6px', zIndex: 50,
              boxShadow: 'var(--shadow-glass)',
              maxHeight: 260, overflowY: 'auto'
            }}>
              {JOB_CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setIsCategoryOpen(false); }}
                  style={{
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    background: category === cat.id ? 'var(--quai-green-10)' : 'transparent',
                    color: category === cat.id ? 'var(--quai-green)' : 'var(--text-primary)',
                    fontSize: 14, fontWeight: category === cat.id ? 600 : 400,
                    transition: 'all 0.2s',
                    marginBottom: 2
                  }}
                  onMouseEnter={e => { if (category !== cat.id) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.color = 'var(--quai-green)'; } }}
                  onMouseLeave={e => { if (category !== cat.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                >
                  {cat.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>DESCRIPTION</label>
        <textarea
          style={{
            width: '100%', minHeight: 200, resize: 'vertical',
            background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)',
            padding: '16px', color: 'var(--text-primary)', fontSize: 14, outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          value={description}
          onChange={e => setDescription(e.target.value)}
          onFocus={e => { e.target.style.borderColor = 'var(--quai-green)'; e.target.style.boxShadow = '0 0 0 2px var(--quai-green-10)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none' }}
          placeholder="Describe deliverables, required skills, and what success looks like."
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: description.length > 2000 ? 'var(--error)' : 'var(--text-secondary)' }}>{description.length} / max 2000 chars</span>
        </div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>SKILLS REQUIRED</label>
        <div className="input" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px', minHeight: 42 }}>
          {skills.map(skill => (
            <span key={skill} style={{ background: 'var(--quai-green-dim)', color: 'var(--quai-green)', borderRadius: 'var(--radius-pill)', padding: '3px 8px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' }}>×</button>
            </span>
          ))}
          <input
            type="text"
            style={{ flex: 1, minWidth: 120, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: 'var(--text-primary)' }}
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder={skills.length < 10 ? "Type and press Enter..." : ""}
            disabled={skills.length >= 10}
          />
        </div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 8 }}>{skills.length} / 10 skills</div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>EXPERIENCE LEVEL</label>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { id: 'Entry', desc: 'New talent, clear instructions, lower budget' },
            { id: 'Intermediate', desc: 'Some experience required, mid-range budget' },
            { id: 'Expert', desc: 'Complex work, specialized skills, higher budget' }
          ].map(level => (
            <div
              key={level.id}
              onClick={() => setExperience(level.id)}
              style={{
                flex: 1, padding: 16, cursor: 'pointer',
                background: experience === level.id ? 'var(--quai-green-10)' : 'var(--bg-surface)',
                border: `1px solid ${experience === level.id ? 'var(--quai-green)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-md)',
                boxShadow: experience === level.id ? '0 0 0 3px var(--quai-green-10)' : 'none',
                transition: 'all var(--transition-fast)',
                position: 'relative'
              }}
            >
              {experience === level.id && <CheckCircle size={16} color="var(--quai-green)" style={{ position: 'absolute', top: 16, right: 16 }} />}
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{level.id}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{level.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <button
          className="btn-primary"
          onClick={() => setStep(2)}
          disabled={!title || !category || !description.trim()}
        >
          Next: Budget & Timeline →
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>BUDGET TYPE</label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            onClick={() => setBudgetType('Fixed Price')}
            style={{
              flex: 1, padding: 16, cursor: 'pointer',
              background: budgetType === 'Fixed Price' ? 'var(--quai-green-10)' : 'var(--bg-surface)',
              border: `1px solid ${budgetType === 'Fixed Price' ? 'var(--quai-green)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: budgetType === 'Fixed Price' ? '0 0 0 3px var(--quai-green-10)' : 'none',
              transition: 'all var(--transition-fast)',
              position: 'relative'
            }}
          >
            {budgetType === 'Fixed Price' && <CheckCircle size={16} color="var(--quai-green)" style={{ position: 'absolute', top: 16, right: 16 }} />}
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Fixed Price</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>💰 Pay a set total for the completed project</div>
          </div>
          <div
            style={{
              flex: 1, padding: 16, cursor: 'not-allowed', opacity: 0.5,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Hourly</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>⏱ Pay per hour of work (coming soon)</div>
          </div>
        </div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>BUDGET (QUAI)</label>
        <input
          type="number"
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 32, color: 'var(--quai-green)', textAlign: 'center',
            padding: '16px 0'
          }}
          value={budget}
          onChange={e => setBudget(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.1"
        />
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>Minimum: 0.1 QUAI</div>

        <div style={{
          background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px', marginTop: 16,
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>≈ {qi.toFixed(2)} Qi</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>≈ {kwh.toFixed(1)} kWh</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--quai-green)' }}>Fee: ~$0.001</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Lock size={12} style={{ marginTop: 2 }} />
          <span>Funds will be locked in a smart contract on Quai Network. Released only when you approve the completed work.</span>
        </div>
      </div>

      <div>
        <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>PROJECT DEADLINE</label>
        <DatePicker
          selected={deadline}
          onChange={(date: Date | null) => setDeadline(date)}
          minDate={new Date()}
          className="input"
          placeholderText="Select a date"
        />
        {deadline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Calendar size={12} />
            {deadline.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {' '}
            ({Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days from now)
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
        <button
          className="btn-primary"
          onClick={() => setStep(3)}
          disabled={!budget || numBudget < 0.1 || !deadline}
        >
          Next: Review →
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>POSTING SUMMARY</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>You will lock</span>
          <QuaiAmount amount={budget} size="md" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>In Qi</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>≈ {qi.toFixed(2)} Qi</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>In kWh</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>≈ {kwh.toFixed(1)} kWh</span>
        </div>

        <hr className="divider" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Quai tx fee</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--success)' }}>~$0.001</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Platform fee</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--success)' }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Upwork would cost</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--error)', textDecoration: 'line-through' }}>${(numBudget * 0.2).toFixed(2)}</span>
        </div>

        <hr className="divider" />

        <div style={{ background: 'var(--quai-green-10)', border: '1px solid var(--quai-green-dim)', borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <ShieldCheck size={12} color="var(--quai-green)" style={{ marginTop: 2 }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Funds return automatically if no proposal is accepted before the deadline.</span>
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: 24, padding: 14 }}
          onClick={() => setIsConfirming(true)}
        >
          Post Job & Lock Escrow
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
      </div>
    </div>
  )

  const previewJob = {
    title: title || 'Job Title',
    description: description || 'Job description will appear here...',
    category: category || 'Category',
    budget: budget || '0',
    deadline: deadline ? Math.floor(deadline.getTime() / 1000) : Math.floor(Date.now() / 1000) + 86400,
    status: 1n,
    createdAt: Math.floor(Date.now() / 1000),
    client: '0x0000000000000000000000000000000000000000',
    skills: skills.length > 0 ? skills : undefined
  }

  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: 1500, margin: '0 auto' }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Dashboard &nbsp;&gt;&nbsp; Post a Job
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Post a New Job</h1>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Fill out the details below to find the perfect freelancer.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Left Column */}
        <div>
          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            {[
              { num: 1, label: 'Job Details' },
              { num: 2, label: 'Budget & Timeline' },
              { num: 3, label: 'Review & Post' }
            ].map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step > s.num ? 'var(--quai-green)' : step === s.num ? 'var(--quai-green-10)' : 'var(--bg-elevated)',
                    border: `2px solid ${step >= s.num ? 'var(--quai-green)' : 'var(--border-default)'}`,
                    color: step > s.num ? 'var(--text-inverse)' : step === s.num ? 'var(--quai-green)' : 'var(--text-muted)',
                    fontSize: 12, fontWeight: 600
                  }}>
                    {step > s.num ? <CheckCircle size={14} /> : s.num}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ flex: 1, height: 2, background: step > s.num ? 'var(--quai-green)' : 'var(--border-default)', margin: '0 16px', alignSelf: 'flex-start', marginTop: 11 }} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Right Column — Live Preview */}
        <div style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
          <div className="section-label" style={{ marginBottom: 12 }}>PREVIEW</div>
          <div className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(78,255,160,0.05), transparent 70%)', pointerEvents: 'none' }} />
            <JobListingCard job={previewJob} proposalsCount={0} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            <CheckCircle size={10} /> Visible to all freelancers instantly after confirmation
          </div>
        </div>
      </div>

      <Modal isOpen={isConfirming} onClose={() => setIsConfirming(false)} title="Confirm Job Posting">
        <p style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>
          You are about to lock {budget} QUAI into a smart contract escrow on Quai Network.
        </p>
        <ul style={{ fontSize: 14, color: 'var(--text-secondary)', paddingLeft: 20, marginBottom: 24, lineHeight: 1.6 }}>
          <li>Funds are held by the contract, not by any company</li>
          <li>Released when you approve the completed work</li>
          <li>Refundable if no freelancer is hired before the deadline</li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--warning)', fontSize: 12, marginBottom: 24 }}>
          <AlertTriangle size={16} />
          This transaction is irreversible. Ensure your budget is correct.
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={() => setIsConfirming(false)} disabled={isPosting}>Cancel</button>
          <button className={`btn-primary ${isPosting ? 'btn-loading' : ''}`} onClick={handlePostJob} disabled={isPosting}>
            {isPosting ? 'Posting...' : 'Confirm & Post →'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
