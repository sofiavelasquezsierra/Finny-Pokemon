import { useState } from 'react'

import {
  CARD_IMAGE_HEIGHT,
  CARD_IMAGE_WIDTH,
  getBackupImageUrl,
  getCardImageUrl
} from '@/lib/image'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  id: number
  imageUrl: string
  name: string
}

type Stage = 'backup' | 'failed' | 'primary'

// Fallback chain: resized original -> seeded backup -> initial placeholder.
// alt="" because the photos are random stock images that don't depict the
// creature, and its name is rendered as text next to the image.
export default function PokemonImage({ className, id, imageUrl, name }: Props) {
  const [stage, setStage] = useState<Stage>('primary')

  if (stage === 'failed') {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center text-5xl font-semibold',
          className
        )}
      >
        {name.charAt(0)}
      </div>
    )
  }

  return (
    <img
      alt=""
      className={cn('bg-muted object-cover', className)}
      decoding="async"
      height={CARD_IMAGE_HEIGHT}
      loading="lazy"
      onError={() =>
        setStage(current => (current === 'primary' ? 'backup' : 'failed'))
      }
      src={
        stage === 'primary' ? getCardImageUrl(imageUrl) : getBackupImageUrl(id)
      }
      width={CARD_IMAGE_WIDTH}
    />
  )
}
