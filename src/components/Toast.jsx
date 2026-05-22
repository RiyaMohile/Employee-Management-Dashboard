// src/components/Toast.jsx
import React, { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  const typeClass = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info'
  }

  return (
    <div className={`toast ${typeClass[type]} text-gray-900 dark:text-white`}>
      <span>{icons[type]}</span>
      <span className="flex-1">{message}</span>
    </div>
  )
}

export default Toast