type personEmail = {
  name?: string
  email: string
}

export type Email = {
  to: personEmail
  cc?: personEmail
  from: personEmail
  subject: string
  message: string
}
