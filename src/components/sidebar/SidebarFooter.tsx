import { Button } from '@/components/ui/Button'

interface SidebarFooterProps {
  onSignOut: () => void
}

export function SidebarFooter({ onSignOut }: SidebarFooterProps) {
  return (
    <div className="p-3 border-t border-neutral-800">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-neutral-400"
        onClick={onSignOut}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign out
      </Button>
    </div>
  )
}
