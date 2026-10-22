export type Pokemon = {
  attack: number
  defense: number
  description: string
  generation: number
  height: number
  hp: number
  id: number
  imageUrl: string
  isLegendary?: boolean
  name: string
  specialAttack: number
  specialDefense: number
  speed: number
  types: string[]
  weight: number
}

export type PokemonPage = {
  data: Pokemon[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export const PAGE_SIZE = 20

export async function fetchPokemonPage({
  page,
  search,
  signal
}: {
  page: number
  search: string
  signal?: AbortSignal
}): Promise<PokemonPage> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: String(page)
  })
  if (search) params.set('search', search)

  // Forward the dev server's demo controls from the page URL. Stripped from
  // production builds, where import.meta.env.DEV is statically false.
  if (import.meta.env.DEV) {
    const pageParams = new URLSearchParams(window.location.search)
    for (const key of ['delay', 'failFrom']) {
      const value = pageParams.get(key)
      if (value) params.set(key, value)
    }
  }

  const res = await fetch(`/api/pokemon?${params}`, { signal })
  // fetch only rejects on network failure, so HTTP errors must be thrown here
  if (!res.ok) throw new Error(`Failed to load Pokemon (HTTP ${res.status})`)

  return (await res.json()) as PokemonPage
}
