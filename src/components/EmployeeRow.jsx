import { Edit, Trash2 } from 'lucide-react'
import React from 'react'

const getAvatarColor = (id) => {
  const colors = [
    '#2563EB', '#7C3AED', '#DB2777', '#D97706',
    '#059669', '#0891B2', '#DC2626', '#65A30D'
  ]
  return colors[id % colors.length]
}

const getDeptClass = (department) => {
  const deptMap = {
    'Engineering': 'dept-eng',
    'Marketing': 'dept-mkt',
    'Sales': 'dept-sal',
    'HR': 'dept-hr',
    'Finance': 'dept-fin',
    'Operations': 'dept-ops'
  }
  return deptMap[department] || 'dept-ops'
}

const EmployeeRow = ({ employee, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: getAvatarColor(employee.id) }}
          >
            {employee.firstName[0]}{employee.lastName[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{employee.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`dept-badge ${getDeptClass(employee.department)}`}>
          {employee.department}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {employee.role}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
        ${employee.salary?.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <span className={`status-badge status-${employee.status}`}>
          <span className="status-dot"></span>
          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="w-8 h-8 flex items-center justify-center rounded-lg  text-gray-500 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
            title="Edit"
          >
            <Edit size={18} strokeWidth={2.5}/>
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="w-8 h-8 flex items-center justify-center rounded-lg  text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} strokeWidth={2.5}/>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EmployeeRow