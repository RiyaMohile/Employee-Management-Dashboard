import React from 'react'
import { TrendingUp, TrendingDown, Users, UserCheck, Building2, DollarSign } from 'lucide-react'

const StatCard = ({ label, value, icon: IconComponent, iconBg, iconColor, change, changeType = 'up' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>
      </div>
      <div className="font-['Syne'] text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      {change && (
        <div className={`text-xs flex items-center gap-1 ${changeType === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
  )
}

export default StatCard