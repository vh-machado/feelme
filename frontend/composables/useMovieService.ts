import type { UseFetchOptions } from 'nuxt/app'

export function useMovieService<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()
  const token = useCookie('authToken')

  return useLazyFetch(url, {
    ...options,
    baseURL: config.public.gatewayBaseUrl + '/movie-service/api/',
    headers: {
      'x-auth-token': String(token?.value?.token),
      'Content-Type': 'application/json'
    },
    server: false
  })
}