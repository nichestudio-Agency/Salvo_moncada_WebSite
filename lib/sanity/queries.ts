export const opereInEvidenzaQuery = `
  *[_type == "opera"] | order(_createdAt desc) [0...3] {
    _id,
    titolo,
    slug,
    immaginiPrincipali,
    serie->{ nome, slug },
    anno,
    dimensioni,
    tecnica,
    disponibilita,
    prezzo,
    inEvidenza
  }
`

export const tutteLeOpereQuery = `
  *[_type == "opera"] | order(anno desc) {
    _id,
    titolo,
    slug,
    immaginiPrincipali,
    serie->{ nome, slug },
    anno,
    dimensioni,
    tecnica,
    disponibilita,
    prezzo,
    inEvidenza,
    tags
  }
`

export const operaBySlugQuery = `
  *[_type == "opera" && slug.current == $slug][0] {
    _id,
    titolo,
    slug,
    immaginiPrincipali,
    serie->{ _id, nome, slug },
    anno,
    dimensioni,
    tecnica,
    numeroPezzo,
    descrizione,
    disponibilita,
    prezzo,
    inEvidenza,
    tags
  }
`

export const tutteLeSerieQuery = `
  *[_type == "serie"] | order(ordine asc) {
    _id,
    nome,
    slug,
    descrizione,
    immagineCopertina
  }
`

export const artistaQuery = `
  *[_type == "artista"][0] {
    _id,
    nome,
    fotoHero,
    fotoProfilo,
    tagline,
    bio,
    citazione,
    esposizioni,
    fotoStudio,
    email,
    instagram,
    facebook
  }
`
