import type { UseFetchOptions } from 'nuxt/app'

export function useMovieService<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()
  const authToken = useCookie<string>('authToken')

  return useLazyFetch(url, {
    ...options,
    baseURL: config.public.gatewayBaseUrl + '/movie-service/api/',
    headers: {
      'x-auth-token': String(authToken.value),
      'Content-Type': 'application/json'
    },
    server: false
  })
}