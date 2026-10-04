import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ShieldCheck } from 'lucide-react'

export const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError('Invalid credentials')
      setLoading(false)
    } else {
      // Check role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') {
          await supabase.auth.signOut()
          setError('Invalid credentials') // Hide that they exist but are student
          setLoading(false)
          return
        }
      }
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-lg shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-zinc-100 p-4 rounded-full">
            <ShieldCheck className="w-8 h-8 text-zinc-900" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-zinc-900 mb-8">Admin Portal</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded px-4 py-2 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-900"
              placeholder="admin@campus.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded px-4 py-2 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 text-zinc-900"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 rounded transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
