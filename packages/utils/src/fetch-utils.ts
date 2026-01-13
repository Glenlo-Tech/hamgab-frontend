interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  timeout?: number
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  maxRetries = 3
): Promise<Response> {
  const { retries = maxRetries, retryDelay = 1000, timeout = 10000, ...fetchOptions } = options
  
  let lastError: Error
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        return response
      }
      
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`)
      }
      
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error as Error
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

export const swrFetcher = async (url: string) => {
  const response = await fetchWithRetry(url, { retries: 3 })
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  return response.json()
}

