import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'

import { fetchPokemonPage, type PokemonPage } from '@/lib/api'

export function usePokemonQuery(search: string) {
  return useInfiniteQuery({
    // The server can report hasNext on an empty page (e.g. limit=0), so
    // require data too, otherwise the sentinel would fetch forever
    getNextPageParam: (lastPage: PokemonPage) =>
      lastPage.pagination.hasNext && lastPage.data.length > 0
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam, signal }) =>
      fetchPokemonPage({ page: pageParam, search, signal }),
    queryKey: ['pokemon', search]
  })
}
