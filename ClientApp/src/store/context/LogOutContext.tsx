import React from 'react'

import {LogOutType} from 'lib/type/global/global'

const LogOutContext = React.createContext<any>(undefined)
function LogOutProvider({children}: {children: React.ReactNode}) {
  const [logOut, setLogOut] = React.useState<LogOutType>()
  const value = {logOut, setLogOut}
  return <LogOutContext.Provider value={value}>{children}</LogOutContext.Provider>
}

function useLogOut() {
  const context = React.useContext(LogOutContext)

  if (context === undefined) {
    throw new Error('useLogOut must be used within a LogOutProvider')
  }

  return context
}

export {LogOutProvider, useLogOut}
