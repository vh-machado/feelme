import type { UseFetchOptions } from 'nuxt/app'

export function useSocialService<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()

  return useLazyFetch(url, {
    ...options,
    baseURL: config.public.gatewayBaseUrl + '/social-service/api/social',
    headers: {
      'Content-Type': 'application/json'
    },
    server: false
  })
}