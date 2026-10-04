import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, FileText, Activity, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/events', icon: Calendar, label: 'Events' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/audit', icon: FileText, label: 'Audit Log' },
  { path: '/admin/performance', icon: Activity, label: 'Performance' },
]

export const AdminLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Campus Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
