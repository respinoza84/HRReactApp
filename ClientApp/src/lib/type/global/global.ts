type SeverityType = 'error' | 'info' | 'success' | 'warning'

export type NavTabType = {
  id: string
  label: string
  active: boolean
}

export type ToastType = {
  id?: number
  message?: string
  type: SeverityType
  title?: string
  persist?: boolean
}

export type LogOutType = {
  active: boolean
}
