import React, { useState, useMemo } from 'react'
import { useEmployees } from '../context/EmployeeContext'
import EmployeeRow from '../components/EmployeeRow'
import EmployeeModal from '../components/EmployeeModal'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { Search } from 'lucide-react'

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, loading } = useEmployees()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  
  const itemsPerPage = 8

  const filteredEmployees = useMemo(() => {
    let filtered = [...employees]
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term)
      )
    }
    
    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter)
    }
    
    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter)
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = sortConfig.key === 'name' ? `${a.firstName} ${a.lastName}` : a[sortConfig.key]
        let bVal = sortConfig.key === 'name' ? `${b.firstName} ${b.lastName}` : b[sortConfig.key]
        if (typeof aVal === 'string') aVal = aVal.toLowerCase()
        if (typeof bVal === 'string') bVal = bVal.toLowerCase()
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return filtered
  }, [employees, searchTerm, departmentFilter, statusFilter, sortConfig])

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredEmployees.slice(start, start + itemsPerPage)
  }, [filteredEmployees, currentPage])

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSaveEmployee = (employeeData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData)
      showToast('Employee updated successfully ✓', 'success')
    } else {
      addEmployee(employeeData)
      showToast('Employee added successfully ✓', 'success')
    }
    setModalOpen(false)
    setEditingEmployee(null)
  }

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteEmployee(deleteConfirm.id)
      showToast('Employee deleted', 'error')
      setDeleteConfirm(null)
    }
  }

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setDepartmentFilter('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin-custom"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold font-['Syne'] text-gray-900 dark:text-white">Employees</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{filteredEmployees.length} employees found</p>
        </div>
        <button onClick={() => { setEditingEmployee(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          ＋ Add Employee
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <span className="text-gray-400"><Search size={18} strokeWidth={2.5}/></span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white text-sm"
          />
        </div>
        <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm cursor-pointer">
          <option value="">All Departments</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>HR</option>
          <option>Finance</option>
          <option>Operations</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm cursor-pointer">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        {(searchTerm || departmentFilter || statusFilter) && (
          <button onClick={resetFilters} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Clear filters ✕
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Employee {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('department')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Department {sortConfig.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('role')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('salary')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Salary {sortConfig.key === 'salary' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="text-4xl mb-2 opacity-40">🔍</div>
                    <p className="text-gray-500 dark:text-gray-400">No employees match your search</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map(emp => (
                  <EmployeeRow
                    key={emp.id}
                    employee={emp}
                    onEdit={(emp) => { setEditingEmployee(emp); setModalOpen(true); }}
                    onDelete={(emp) => setDeleteConfirm(emp)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
            </div>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="min-w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                
                if (pageNum > totalPages) return null
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-lg border transition-colors ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="min-w-[34px] h-[34px] flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
            </div>
          </div>
        )}
      </div>
      
      <EmployeeModal isOpen={modalOpen} employee={editingEmployee} onSave={handleSaveEmployee} onClose={() => { setModalOpen(false); setEditingEmployee(null); }} />
      <ConfirmModal isOpen={!!deleteConfirm} employeeName={deleteConfirm ? `${deleteConfirm.firstName} ${deleteConfirm.lastName}` : ''} onConfirm={handleDelete} onClose={() => setDeleteConfirm(null)} />
      
      {toast && <div className="fixed bottom-6 right-6 z-50"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}
    </div>
  )
}

export default Employees