type SeverityType = 'error' | 'info' | 'success' | 'warning'

type GlobalMessage = {
  type: SeverityType
  message: string
}

type FieldMessage = {
  fieldId: string
  type: SeverityType
  message: string
}

export type ErrorMessages = {
  message: any
  globalMessages: GlobalMessage[]
  fieldMessages: FieldMessage[]
}