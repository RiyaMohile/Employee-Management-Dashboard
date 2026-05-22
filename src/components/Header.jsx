import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard'
    if (location.pathname === '/employees') return 'Employees'
    return 'EmpDesk'
  }

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b  border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell  size={18} strokeWidth={2.5} />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header