import type { Metadata } from 'next'
import { sanityClient } from '@/lib/sanity/client'
import { tutteLeOpereQuery, tutteLeSerieQuery } from '@/lib/sanity/queries'
import type { Opera, Serie } from '@/types/sanity'
import type { OperaConSrc } from '@/components/galleria/GalleriaClient'
import GalleriaClient from '@/components/galleria/GalleriaClient'

export const metadata: Metadata = {
  title: 'Galleria | Salvo Moncada',
  description: 'Sfoglia tutte le tegole dipinte di Salvo Moncada. Scene di vita siciliana dipinte a mano su maiolica.',
}

export const dynamic = 'force-dynamic'

const staticOpere: OperaConSrc[] = [
  { _id: '1',  _type: 'opera', titolo: 'Scena di Paese',   slug: { current: 'scena-di-paese'   }, staticSrc: '/opere/opera-01.jpg', anno: 2024, disponibilita: 'disponibile',    inEvidenza: true,  immaginiPrincipali: [] },
  { _id: '2',  _type: 'opera', titolo: 'La Raccolta',       slug: { current: 'la-raccolta'       }, staticSrc: '/opere/opera-02.jpg', anno: 2024, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '3',  _type: 'opera', titolo: 'Il Mercato',        slug: { current: 'il-mercato'        }, staticSrc: '/opere/opera-03.jpg', anno: 2023, disponibilita: 'venduta',        inEvidenza: false, immaginiPrincipali: [] },
  { _id: '4',  _type: 'opera', titolo: 'La Fontana',        slug: { current: 'la-fontana'        }, staticSrc: '/opere/opera-04.jpg', anno: 2023, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '5',  _type: 'opera', titolo: 'Festa del Santo',   slug: { current: 'festa-del-santo'   }, staticSrc: '/opere/opera-05.jpg', anno: 2024, disponibilita: 'riservata',      inEvidenza: false, immaginiPrincipali: [] },
  { _id: '6',  _type: 'opera', titolo: 'La Vendemmia',      slug: { current: 'la-vendemmia'      }, staticSrc: '/opere/opera-06.jpg', anno: 2022, disponibilita: 'disponibile',    inEvidenza: true,  immaginiPrincipali: [] },
  { _id: '7',  _type: 'opera', titolo: 'Vita Quotidiana',   slug: { current: 'vita-quotidiana'   }, staticSrc: '/opere/opera-07.jpg', anno: 2023, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '8',  _type: 'opera', titolo: 'Le Lavandaie',      slug: { current: 'le-lavandaie'      }, staticSrc: '/opere/opera-08.jpg', anno: 2022, disponibilita: 'venduta',        inEvidenza: false, immaginiPrincipali: [] },
  { _id: '9',  _type: 'opera', titolo: 'Il Frantoio',       slug: { current: 'il-frantoio'       }, staticSrc: '/opere/opera-09.jpg', anno: 2024, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '10', _type: 'opera', titolo: 'La Passeggiata',    slug: { current: 'la-passeggiata'    }, staticSrc: '/opere/opera-10.jpg', anno: 2023, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '11', _type: 'opera', titolo: 'Il Pescatore',      slug: { current: 'il-pescatore'      }, staticSrc: '/opere/opera-11.jpg', anno: 2022, disponibilita: 'non_in_vendita', inEvidenza: false, immaginiPrincipali: [] },
  { _id: '12', _type: 'opera', titolo: 'Sera al Paese',     slug: { current: 'sera-al-paese'     }, staticSrc: '/opere/opera-12.jpg', anno: 2024, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
  { _id: '13', _type: 'opera', titolo: 'La Chiesa',         slug: { current: 'la-chiesa'         }, staticSrc: '/opere/opera-13.jpg', anno: 2023, disponibilita: 'riservata',      inEvidenza: false, immaginiPrincipali: [] },
  { _id: '14', _type: 'opera', titolo: 'Giochi in Piazza',  slug: { current: 'giochi-in-piazza'  }, staticSrc: '/opere/opera-14.jpg', anno: 2022, disponibilita: 'disponibile',    inEvidenza: false, immaginiPrincipali: [] },
]

export default async function OperePage() {
  let opere: OperaConSrc[] = staticOpere
  let serie: Serie[] = []

  try {
    const [sanityOpere, sanitySterie] = await Promise.all([
      sanityClient.fetch<Opera[]>(tutteLeOpereQuery),
      sanityClient.fetch<Serie[]>(tutteLeSerieQuery),
    ])
    if (sanityOpere?.length) opere = sanityOpere as OperaConSrc[]
    if (sanitySterie?.length) serie = sanitySterie
  } catch {
    // Sanity non configurato — usa dati statici
  }

  return <GalleriaClient opere={opere} serie={serie} totale={opere.length} />
}
