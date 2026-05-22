import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'

const EmployeeContext = createContext()

export const useEmployees = () => {
  const context = useContext(EmployeeContext)
  if (!context) {
    throw new Error('useEmployees must be used within EmployeeProvider')
  }
  return context
}

const generateMockData = () => {
  const names = [['Arjun','Sharma'],['Priya','Verma'],['Rahul','Singh'],['Anita','Gupta'],
    ['Vikram','Mehta'],['Sneha','Patel'],['Amit','Joshi'],['Kavya','Nair'],
    ['Rohit','Kumar'],['Deepa','Reddy'],['Sanjay','Yadav'],['Pooja','Agarwal']]
  const depts = ['Engineering','Marketing','Sales','HR','Finance','Operations']
  const roles = ['Engineer','Manager','Analyst','Specialist','Lead','Coordinator']
  const stats = ['active', 'active', 'active', 'inactive', 'pending']
  
  return names.map((n, i) => ({
    id: i + 1,
    firstName: n[0],
    lastName: n[1],
    email: `${n[0].toLowerCase()}.${n[1].toLowerCase()}@company.com`,
    phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
    age: 24 + i,
    department: depts[i % depts.length],
    role: roles[i % roles.length],
    salary: 40000 + i * 5000,
    status: stats[i % stats.length]
  }))
}

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasLoadedRef = useRef(false);

  const loadEmployees = useCallback(async () => {
    
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('https://dummyjson.com/users?limit=30&select=firstName,lastName,email,phone,age,company')
      const statuses = ['active', 'active', 'active', 'inactive', 'pending']
      const mappedEmployees = response.data.users.map((u, i) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        age: u.age,
        department: u.company?.department || 'Engineering',
        role: u.company?.title || 'Employee',
        salary: Math.floor(45000 + Math.random() * 80000),
        status: statuses[i % statuses.length]
      }))
      setEmployees(mappedEmployees)
    } catch (err) {
      console.error('Failed to load employees:', err)
      setEmployees(generateMockData())
      setError('Using demo data. API connection failed.')
    } finally {
      setLoading(false)
    }
  },[])

  useEffect(() => {
    loadEmployees()
  }, [])

  const addEmployee = (employee) => {
    const newEmployee = {
      ...employee,
      id: Date.now()
    }
    setEmployees(prev => [newEmployee, ...prev])
    return newEmployee
  }

  const updateEmployee = (id, updatedData) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...updatedData } : emp
    ))
  }

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id))
  }

  return (
    <EmployeeContext.Provider value={{
      employees,
      loading,
      error,
      loadEmployees,
      addEmployee,
      updateEmployee,
      deleteEmployee
    }}>
      {children}
    </EmployeeContext.Provider>
  )
}