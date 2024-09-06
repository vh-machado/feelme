import type { UseFetchOptions } from 'nuxt/app'

export function useMovieAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()

  return useLazyFetch(url, {
    ...options,
    baseURL: config.public.tmdbApiBaseUrl,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${config.public.tmdbApiKey}`
    },
    server: false
  })
}