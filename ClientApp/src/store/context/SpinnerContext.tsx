import React from 'react'

const SpinnerContext = React.createContext<any>(undefined)

function SpinnerProvider({children}: {children: React.ReactNode}) {
  const [spinner, setSpinner] = React.useState<boolean>(false)
  const value = {spinner, setSpinner}
  return <SpinnerContext.Provider value={value}>{children}</SpinnerContext.Provider>
}

function useSpinner() {
  const context = React.useContext(SpinnerContext)

  if (context === undefined) {
    throw new Error('useSpinner must be used within a SpinnerProvider')
  }

  return context
}

export {SpinnerProvider, useSpinner}
