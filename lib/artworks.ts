export type ArtworkCategory =
  | "pescheria"
  | "fruttivendolo"
  | "paesaggio"
  | "personalizzato";

export type Artwork = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  dimensions: string;
  technique: string;
  category: ArtworkCategory;
  available: boolean;
  price?: number;
  images: string[];
};

export async function getArtworks(): Promise<Artwork[]> {
  const { readArtworks } = await import("./data");
  return readArtworks();
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | undefined> {
  const artworks = await getArtworks();
  return artworks.find((a) => a.slug === slug);
}
