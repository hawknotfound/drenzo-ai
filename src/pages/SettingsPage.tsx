import { Button } from '@/components/ui/Button'
import { useAuthContext } from '@/providers/AuthProvider'

export function SettingsPage() {
  const { user, signOut } = useAuthContext()

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-neutral-100 mb-6">Settings</h1>
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-800 p-4">
            <h2 className="text-sm font-medium text-neutral-300 mb-3">Account</h2>
            <p className="text-sm text-neutral-500">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4">
            <h2 className="text-sm font-medium text-neutral-300 mb-3">Appearance</h2>
            <p className="text-sm text-neutral-500">Theme settings coming soon</p>
          </div>
          <Button variant="danger" onClick={signOut}>Sign out</Button>
        </div>
      </div>
    </div>
  )
}
