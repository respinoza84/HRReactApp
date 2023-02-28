import React from 'react'

import {ToastType} from 'lib/type/global/global'

const ToastContext = React.createContext<any>(undefined)

function ToastProvider({children}: {children: React.ReactNode}) {
  const [toast, setToast] = React.useState<ToastType>()
  const value = {toast, setToast}
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

function useToast() {
  const context = React.useContext(ToastContext)

  if (context === undefined) {
    throw new Error('useToastr must be used within a ToastProvider')
  }

  return context
}

export {ToastProvider, useToast}
