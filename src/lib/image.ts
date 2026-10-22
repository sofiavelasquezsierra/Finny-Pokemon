// 2x a ~200px card column, at the card's 4:5 aspect ratio
export const CARD_IMAGE_WIDTH = 400
export const CARD_IMAGE_HEIGHT = 500

const RESIZABLE_HOSTS = new Set(['loremflickr.com', 'picsum.photos'])

// Deterministic stand-in when the original host fails (loremflickr was
// returning HTTP 500 for every image during development)
export function getBackupImageUrl(id: number) {
  return `https://picsum.photos/seed/pokemon-${id}/${CARD_IMAGE_WIDTH}/${CARD_IMAGE_HEIGHT}`
}

// Source images are random sizes up to ~4000px. Both hosts put the size at
// the end of the path (picsum /seed/<s>/<w>/<h>, loremflickr /<w>/<h>), so
// request one sized for the card instead.
export function getCardImageUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (!RESIZABLE_HOSTS.has(parsed.hostname)) return url

    parsed.pathname = parsed.pathname.replace(
      /\/\d+\/\d+$/,
      `/${CARD_IMAGE_WIDTH}/${CARD_IMAGE_HEIGHT}`
    )
    return parsed.toString()
  } catch {
    return url
  }
}
