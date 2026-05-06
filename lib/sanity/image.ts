import type { SanityImage } from '@/types/sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

function parseRef(ref: string) {
  const parts = ref.replace('image-', '').split('-')
  const format = parts.pop()!
  const id = parts.join('-')
  return { id, format }
}

type Builder = {
  width: (w: number) => Builder
  height: (h: number) => Builder
  url: () => string
}

export function urlFor(source: SanityImage): Builder {
  let w: number | undefined
  let h: number | undefined

  const build = (): string => {
    if (!projectId || !source?.asset?._ref) return ''
    const { id, format } = parseRef(source.asset._ref)
    let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`
    const params: string[] = []
    if (w) params.push(`w=${w}`)
    if (h) params.push(`h=${h}`)
    if (params.length) url += '?' + params.join('&')
    return url
  }

  const builder: Builder = {
    width: (value: number) => { w = value; return builder },
    height: (value: number) => { h = value; return builder },
    url: build,
  }

  return builder
}
