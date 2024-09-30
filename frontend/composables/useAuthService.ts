import type { UseFetchOptions } from 'nuxt/app'

export function useAuthService<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()

  return useFetch(url, {
    ...options,
    baseURL: config.public.gatewayBaseUrl + '/auth-service/api/auth',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}