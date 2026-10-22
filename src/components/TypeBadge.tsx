import { cn } from '@/lib/utils'

// Full class strings, not `bg-${color}-500`: Tailwind only generates classes
// it finds literally in the source. Tinted chips keep text >= 7:1 contrast.
const typeStyles: Record<string, string> = {
  Bug: 'bg-lime-500/20 text-lime-300 ring-lime-500/30',
  Dark: 'bg-slate-500/20 text-slate-300 ring-slate-500/30',
  Dragon: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
  Electric: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
  Fairy: 'bg-pink-500/20 text-pink-300 ring-pink-500/30',
  Fighting: 'bg-orange-500/20 text-orange-300 ring-orange-500/30',
  Fire: 'bg-red-500/20 text-red-300 ring-red-500/30',
  Flying: 'bg-sky-500/20 text-sky-300 ring-sky-500/30',
  Ghost: 'bg-purple-500/20 text-purple-300 ring-purple-500/30',
  Grass: 'bg-green-500/20 text-green-300 ring-green-500/30',
  Ground: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
  Ice: 'bg-cyan-500/20 text-cyan-300 ring-cyan-500/30',
  Normal: 'bg-neutral-500/20 text-neutral-300 ring-neutral-500/30',
  Poison: 'bg-fuchsia-500/20 text-fuchsia-300 ring-fuchsia-500/30',
  Psychic: 'bg-rose-500/20 text-rose-300 ring-rose-500/30',
  Rock: 'bg-stone-500/20 text-stone-300 ring-stone-500/30',
  Steel: 'bg-zinc-500/20 text-zinc-300 ring-zinc-500/30',
  Water: 'bg-blue-500/20 text-blue-300 ring-blue-500/30'
}

export default function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        typeStyles[type] ?? typeStyles.Normal
      )}
    >
      {type}
    </span>
  )
}
