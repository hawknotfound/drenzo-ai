import { Input } from '@/components/ui/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="px-3 py-2 border-b border-neutral-800">
      <Input
        placeholder="Search conversations..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs"
      />
    </div>
  )
}
