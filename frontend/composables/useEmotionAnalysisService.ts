import type { UseFetchOptions } from 'nuxt/app'

export function useEmotionAnalysisService<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()
  const authToken = useCookie<string>('authToken')

  return useLazyFetch(url, {
    ...options,
    baseURL: config.public.gatewayBaseUrl + '/emotion-analysis-service/api',
    headers: {
      'x-auth-token': String(authToken.value),
      'Content-Type': 'application/json'
    },
    server: false
  })
}