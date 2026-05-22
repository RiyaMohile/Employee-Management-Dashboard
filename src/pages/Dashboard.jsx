import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useEmployees } from '../context/EmployeeContext'
import StatCard from '../components/StatCard'
import EmployeeRow from '../components/EmployeeRow'
import { Users, UserCheck, Building2, DollarSign } from 'lucide-react'

const Dashboard = () => {
  const { employees, loading } = useEmployees()

  const stats = useMemo(() => {
    const total = employees.length
    const active = employees.filter(e => e.status === 'active').length
    const departments = new Set(employees.map(e => e.department)).size
    const avgSalary = total ? Math.round(employees.reduce((s, e) => s + (e.salary || 0), 0) / total) : 0
    const recent = employees.slice(0, 6)
    return { total, active, departments, avgSalary, recent }
  }, [employees])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-['Syne'] text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Total Employees" 
          value={stats.total} 
          icon={Users}
          iconBg="#EFF6FF" 
          iconColor="#2563EB"
          change="+2 this month"
          changeType="up"
        />
        <StatCard 
          label="Active" 
          value={stats.active} 
          icon={UserCheck}
          iconBg="#ECFDF5" 
          iconColor="#16A34A"
          change="Good standing"
          changeType="up"
        />
        <StatCard 
          label="Departments" 
          value={stats.departments} 
          icon={Building2}
          iconBg="#FDF4FF" 
          iconColor="#7E22CE"
        />
        <StatCard 
          label="Avg. Salary" 
          value={`$${(stats.avgSalary / 1000).toFixed(0)}k`} 
          icon={DollarSign}
          iconBg="#FFFBEB" 
          iconColor="#D97706"
          change="Market rate"
          changeType="up"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Recent Employees</span>
          <Link 
            to="/employees" 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Employee</th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Department</th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Role</th>
                <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map(emp => (
                <EmployeeRow key={emp.id} employee={emp} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard