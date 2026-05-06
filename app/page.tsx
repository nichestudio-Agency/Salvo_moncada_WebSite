import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import AboutTeaser from "@/components/sections/AboutTeaser";
import { getArtworks } from "@/lib/artworks";

export default async function HomePage() {
  const artworks = await getArtworks();
  const featured = artworks.filter((a) => a.available).slice(0, 3);

  return (
    <>
      <Hero />
      <FeaturedWorks artworks={featured} />
      <AboutTeaser />
    </>
  );
}
