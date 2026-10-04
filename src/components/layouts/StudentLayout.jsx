import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, Users, Calendar, Inbox, User } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', icon: Home, label: 'Discover' },
  { path: '/teammates', icon: Users, label: 'Teammates' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/my-events', icon: Inbox, label: 'Inbox' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export const StudentLayout = () => {
  const location = useLocation()

  // Hide nav on matches chat or full screen modes if needed
  const isMatchChat = location.pathname.startsWith('/matches/')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col md:flex-row">
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden pb-16 md:pb-0 md:pl-20">
        <Outlet />
      </main>

      {/* Navigation - Bottom on mobile, Side rail on desktop */}
      {!isMatchChat && (
        <nav className="fixed bottom-0 w-full md:w-20 md:h-screen bg-zinc-900/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-white/10 z-50">
          <div className="flex md:flex-col justify-around md:justify-center items-center h-16 md:h-full gap-2 md:gap-8 px-2 md:px-0">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative p-3 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-accent/20 rounded-xl"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-accent' : ''}`} />
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
