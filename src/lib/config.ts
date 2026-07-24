export const FOUNDER_EMAIL = 'shubhamnagda08@gmail.com'

export function isFounder(email?: string | null): boolean {
  return email?.toLowerCase() === FOUNDER_EMAIL.toLowerCase()
}
