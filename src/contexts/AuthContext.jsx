import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchProfile = async (sessionUser) => {
      if (!sessionUser) {
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single()

      if (mounted) {
        setUser(sessionUser)
        if (data) {
          // Also fetch student data for onboarding status if student
          if (data.role === 'student' && data.student_id) {
            const { data: studentData } = await supabase
              .from('students')
              .select('onboarding_done')
              .eq('id', data.student_id)
              .single()
            
            setProfile({ ...data, ...studentData })
          } else {
            setProfile(data)
          }
        }
        setLoading(false)
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
