const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = '2024-01-01'

export const sanityClient = {
  fetch: async <T>(query: string, params?: Record<string, unknown>): Promise<T> => {
    if (!projectId) {
      throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID non configurato')
    }

    const queryString = encodeURIComponent(query)
    const paramsString = params
      ? '&' + Object.entries(params).map(([k, v]) => `$${k}=${encodeURIComponent(JSON.stringify(v))}`).join('&')
      : ''

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${queryString}${paramsString}`

    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`Sanity fetch error: ${res.status}`)
    const json = await res.json()
    return json.result as T
  },
}
