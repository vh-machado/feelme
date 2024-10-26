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

// Função alternativa usando `fetch`
export async function useMovieServiceFetch<T>(
  url: string | (() => string),
  options?: RequestInit
): Promise<T | null> {
  const config = useRuntimeConfig()
  const token = useCookie('authToken')
  
  const requestUrl = typeof url === 'function' ? url() : url

  try {
    const response = await fetch(`${config.public.gatewayBaseUrl}/movie-service/api/${requestUrl}`, {
      ...options,
      headers: {
        'x-auth-token': String(token?.value?.token),
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch data from ${requestUrl}. Status: ${response.status}`)
      return null
    }

    return await response.json() as T
  } catch (error) {
    console.error("Error fetching data:", error)
    return null
  }
}