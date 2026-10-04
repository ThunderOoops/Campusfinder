import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'

const SKILLS = ["python", "java", "c++", "javascript", "react", "node", "ml", "design", "sql"]
const INTERESTS = ["hackathons", "open_source", "gaming", "music", "sports", "ai_research", "startups"]

export const Onboarding = () => {
  const { profile } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [skills, setSkills] = useState([])
  const [interests, setInterests] = useState([])
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleItem = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    
    // Generate random avatar color
    const hue = Math.floor(Math.random() * 360)
    const avatar_color = `hsl(${hue}, 70%, 50%)`

    const { error } = await supabase
      .from('students')
      .update({
        skills,
        interests,
        bio,
        avatar_color,
        onboarding_done: true
      })
      .eq('id', profile.student_id)

    if (!error) {
      window.location.href = '/' // Force reload to update auth context state fully
    } else {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-accent' : 'bg-zinc-800'}`} />
          ))}
        </div>

        <div className="glass rounded-3xl p-8 card-glow overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold mb-2">What are your skills?</h2>
                <p className="text-zinc-400 mb-6">Select the tools and languages you know.</p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {SKILLS.map(skill => {
                    const selected = skills.includes(skill)
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleItem(skills, setSkills, skill)}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          selected 
                            ? 'bg-accent/20 border-accent text-accent-100' 
                            : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/30'
                        }`}
                      >
                        {skill}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-auto flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={skills.length === 0}
                    className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-2 rounded-full font-medium disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold mb-2">What are you into?</h2>
                <p className="text-zinc-400 mb-6">Pick a few interests to find better matches.</p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {INTERESTS.map(interest => {
                    const selected = interests.includes(interest)
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleItem(interests, setInterests, interest)}
                        className={`px-4 py-2 rounded-full border transition-all ${
                          selected 
                            ? 'bg-accent/20 border-accent text-accent-100' 
                            : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/30'
                        }`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-auto flex justify-between">
                  <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white px-4 py-2">Back</button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={interests.length === 0}
                    className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-2 rounded-full font-medium disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold mb-2">Write a short bio</h2>
                <p className="text-zinc-400 mb-6">Tell potential teammates a bit about yourself.</p>
                
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="I'm a computer science student looking for a team to build an AI project..."
                  className="w-full h-32 bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none mb-8"
                  maxLength={200}
                />
                
                <div className="mt-auto flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="text-zinc-400 hover:text-white px-4 py-2">Back</button>
                  <button 
                    onClick={handleComplete}
                    disabled={loading || bio.length < 10}
                    className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (
                      <>Complete <Check className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
