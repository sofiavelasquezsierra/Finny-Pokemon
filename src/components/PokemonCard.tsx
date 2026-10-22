import { useId, useState } from 'react'

import type { Pokemon } from '@/lib/api'

import { cn } from '@/lib/utils'

import PokemonImage from './PokemonImage'
import TypeBadge from './TypeBadge'

// Highest possible stat in the data (hp tops out at 255)
const STAT_MAX = 255

const STATS = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'specialAttack', label: 'Sp. Atk', srLabel: 'Special Attack' },
  { key: 'specialDefense', label: 'Sp. Def', srLabel: 'Special Defense' },
  { key: 'speed', label: 'Speed' }
] as const

// Both faces share one grid cell, so the card is as tall as its taller face
const FACE = 'bg-card rounded-xl [backface-visibility:hidden] [grid-area:1/1]'

type FaceProps = {
  className: string
  id?: string
  inert: boolean
  pokemon: Pokemon
}

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const backId = useId()

  return (
    <div className="relative h-full [perspective:1200px]">
      <div
        className={cn(
          'grid h-full transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped && 'motion-safe:[transform:rotateY(180deg)]'
        )}
      >
        {/* inert hides the face that's turned away from keyboard and screen readers */}
        <CardFront
          className={cn(FACE, isFlipped && 'motion-reduce:opacity-0')}
          inert={isFlipped}
          pokemon={pokemon}
        />
        <CardBack
          className={cn(
            FACE,
            'motion-safe:[transform:rotateY(180deg)]',
            !isFlipped && 'motion-reduce:opacity-0'
          )}
          id={backId}
          inert={!isFlipped}
          pokemon={pokemon}
        />
      </div>

      {/* One button over the whole card: the faces stay outside it, which keeps
          the HTML valid (no headings or lists inside a button) and keeps the
          button's accessible name short */}
      <button
        aria-controls={backId}
        aria-expanded={isFlipped}
        aria-label={`${pokemon.name} details`}
        className="focus-visible:ring-ring focus-visible:ring-offset-background absolute inset-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        onClick={() => setIsFlipped(flipped => !flipped)}
        type="button"
      />
    </div>
  )
}

function CardBack({ className, id, inert, pokemon }: FaceProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 text-sm transition-opacity',
        className
      )}
      id={id}
      inert={inert}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-bold">{pokemon.name}</h2>
        {pokemon.isLegendary && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/30 ring-inset">
            Legendary
          </span>
        )}
      </div>

      <p className="text-muted-foreground line-clamp-3">
        {pokemon.description}
      </p>

      <dl className="flex flex-col gap-1.5">
        {STATS.map(stat => (
          <div className="flex items-center gap-2" key={stat.key}>
            <dt className="text-muted-foreground w-16 shrink-0">
              {'srLabel' in stat ? (
                <>
                  <span aria-hidden="true">{stat.label}</span>
                  <span className="sr-only">{stat.srLabel}</span>
                </>
              ) : (
                stat.label
              )}
            </dt>
            <dd className="flex flex-1 items-center gap-2">
              <span className="w-8 text-right font-semibold tabular-nums">
                {pokemon[stat.key]}
              </span>
              <span
                aria-hidden="true"
                className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full"
              >
                <span
                  className="bg-primary block h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (pokemon[stat.key] / STAT_MAX) * 100)}%`
                  }}
                />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      {/* Units are assumed: the data has none, but its ranges match m / kg */}
      <dl className="border-border mt-auto grid grid-cols-3 gap-2 border-t pt-3 text-center text-xs">
        <div>
          <dt className="text-muted-foreground">Height</dt>
          <dd className="font-semibold">{pokemon.height.toFixed(1)} m</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Weight</dt>
          <dd className="font-semibold">{pokemon.weight.toFixed(1)} kg</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">
            <span aria-hidden="true">Gen</span>
            <span className="sr-only">Generation</span>
          </dt>
          <dd className="font-semibold">{pokemon.generation}</dd>
        </div>
      </dl>
    </div>
  )
}

function CardFront({ className, inert, pokemon }: FaceProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden transition-opacity',
        className
      )}
      inert={inert}
    >
      <PokemonImage
        className="aspect-[4/5] w-full"
        id={pokemon.id}
        imageUrl={pokemon.imageUrl}
        name={pokemon.name}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
        <h2 className="text-base font-bold">{pokemon.name}</h2>
        <div className="flex flex-wrap justify-center gap-1">
          {pokemon.types.map(type => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}
