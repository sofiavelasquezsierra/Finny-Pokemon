import { useEffect, useRef, useState } from 'react'

import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { usePokemonQuery } from '@/hooks/usePokemonQuery'
import {
  readUrlSearchParam,
  useSyncUrlSearchParam
} from '@/hooks/useUrlSearchParam'
import { cn } from '@/lib/utils'

import CardSkeleton from './CardSkeleton'
import PokemonCard from './PokemonCard'
import { Input } from './ui/input'

const SEARCH_DEBOUNCE_MS = 300
// Two rows at the widest (5-column) layout, then one row per next page
const INITIAL_SKELETONS = 10
const NEXT_PAGE_SKELETONS = 5

const BUTTON =
  'bg-primary text-primary-foreground focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer rounded-md px-4 py-2 text-sm font-medium outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2'

export default function PokemonGrid() {
  const [input, setInput] = useState(() => readUrlSearchParam('search'))
  const search = useDebouncedValue(input.trim(), SEARCH_DEBOUNCE_MS)
  useSyncUrlSearchParam('search', search)

  const inputRef = useRef<HTMLInputElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    isPlaceholderData,
    isSuccess,
    refetch
  } = usePokemonQuery(search)
  const pokemon = data?.pages.flatMap(page => page.data) ?? []

  const { isIntersecting, ref: sentinelRef } =
    useIntersectionObserver<HTMLDivElement>('400px')

  // Keeps loading while the sentinel stays visible (e.g. on tall screens).
  // isPlaceholderData blocks paging the previous search's results.
  useEffect(() => {
    if (
      isIntersecting &&
      hasNextPage &&
      !isFetching &&
      !isPlaceholderData &&
      !isFetchNextPageError
    ) {
      void fetchNextPage()
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchNextPageError,
    isIntersecting,
    isPlaceholderData
  ])

  const total = data?.pages[0].pagination.total ?? 0
  // A failed next page keeps the loaded cards; only a failed first page
  // replaces the grid
  const isInitialError = isError && !isFetchNextPageError
  const isEmpty = isSuccess && !isPlaceholderData && pokemon.length === 0
  const isEnd =
    isSuccess && !isPlaceholderData && !hasNextPage && pokemon.length > 0

  let statusMessage = ''
  if (isPending) statusMessage = 'Loading creatures…'
  else if (isInitialError) statusMessage = 'Couldn’t load creatures.'
  else if (isSuccess)
    statusMessage = `${total} ${total === 1 ? 'creature' : 'creatures'} found`

  const clearSearch = () => {
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-12">
      <search className="mx-auto w-full max-w-2xl">
        <label className="sr-only" htmlFor="pokemon-search">
          Search creatures
        </label>
        <Input
          id="pokemon-search"
          onChange={event => setInput(event.target.value)}
          placeholder="Search for a creature…"
          ref={inputRef}
          type="search"
          value={input}
        />
      </search>

      {/* Always mounted: screen readers only announce changes to live
          regions that already exist in the DOM */}
      <p aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      {isInitialError ? (
        <div
          className="mx-auto flex flex-col items-center gap-4 text-center"
          role="alert"
        >
          <p>Something went wrong loading creatures.</p>
          <button className={BUTTON} onClick={() => void refetch()} type="button">
            Try again
          </button>
        </div>
      ) : isEmpty ? (
        <div className="mx-auto flex flex-col items-center gap-4 text-center">
          <p>No creatures match “{search}”.</p>
          <button className={BUTTON} onClick={clearSearch} type="button">
            Clear search
          </button>
        </div>
      ) : (
        // role="list" restores list semantics that Safari drops with list-style: none
        <ul
          aria-busy={isPlaceholderData}
          className={cn(
            'grid grid-cols-1 gap-8 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
            isPlaceholderData && 'opacity-50'
          )}
          role="list"
        >
          {pokemon.map(p => (
            <li key={p.id}>
              <PokemonCard pokemon={p} />
            </li>
          ))}
          {(isPending || isFetchingNextPage) &&
            Array.from(
              { length: isPending ? INITIAL_SKELETONS : NEXT_PAGE_SKELETONS },
              (_, i) => (
                <li aria-hidden="true" key={`skeleton-${i}`}>
                  <CardSkeleton />
                </li>
              )
            )}
        </ul>
      )}

      {isFetchNextPageError && (
        <div
          className="mx-auto flex flex-col items-center gap-4 text-center"
          role="alert"
        >
          <p>Couldn’t load more creatures.</p>
          <button
            className={BUTTON}
            onClick={() => void fetchNextPage()}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      {isEnd && (
        <p className="text-muted-foreground mx-auto rounded-full border px-8 py-3">
          No more creatures found.
        </p>
      )}

      <div aria-hidden="true" className="h-px" ref={sentinelRef} />
    </div>
  )
}
