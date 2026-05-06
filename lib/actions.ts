"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readArtworks, writeArtworks, readOrders, writeOrders } from "./data";
import type { Artwork, ArtworkCategory } from "./artworks";

// ─── Auth ─────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "salvo2024";
const COOKIE_NAME = "admin_session";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function adminLogin(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  if (!password || hashPassword(password) !== hashPassword(ADMIN_PASSWORD)) {
    return { error: "Password errata" };
  }
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hashPassword(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(
  _prevState: { success?: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const nome = (formData.get("nome") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const scena = (formData.get("scena") as string)?.trim();

  if (!nome || !email || !scena) {
    return { error: "Compila tutti i campi obbligatori." };
  }

  const orders = await readOrders();
  orders.push({
    id: crypto.randomUUID(),
    nome,
    email,
    scena,
    dimensione: (formData.get("dimensione") as string) || undefined,
    budget: (formData.get("budget") as string) || undefined,
    messaggio: (formData.get("messaggio") as string)?.trim() || undefined,
    status: "nuovo",
    createdAt: new Date().toISOString(),
  });
  await writeOrders(orders);
  return { success: true };
}

export async function updateOrderStatus(id: string, status: "nuovo" | "in-lavorazione" | "completato") {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    await writeOrders(orders);
  }
  revalidatePath("/admin/ordini");
}

export async function deleteOrder(id: string) {
  const orders = await readOrders();
  await writeOrders(orders.filter((o) => o.id !== id));
  revalidatePath("/admin/ordini");
}

// ─── Artworks ─────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createArtwork(
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return { error: "Il titolo è obbligatorio." };

  const artworks = await readArtworks();
  const slug = slugify(title);

  if (artworks.find((a) => a.slug === slug)) {
    return { error: "Esiste già un'opera con questo titolo (slug duplicato)." };
  }

  const priceRaw = formData.get("price") as string;
  const artwork: Artwork = {
    slug,
    title,
    subtitle: (formData.get("subtitle") as string)?.trim() ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    year: parseInt(formData.get("year") as string) || new Date().getFullYear(),
    dimensions: (formData.get("dimensions") as string)?.trim() ?? "",
    technique: (formData.get("technique") as string)?.trim() ?? "",
    category: (formData.get("category") as ArtworkCategory) ?? "paesaggio",
    available: formData.get("available") === "true",
    price: priceRaw ? parseInt(priceRaw) : undefined,
    images: [(formData.get("image") as string)?.trim() || "/images/artworks/hero-tile.jpg"],
  };

  artworks.push(artwork);
  await writeArtworks(artworks);
  revalidatePath("/galleria");
  revalidatePath("/");
  redirect("/admin/prodotti");
}

export async function updateArtwork(
  slug: string,
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const artworks = await readArtworks();
  const idx = artworks.findIndex((a) => a.slug === slug);
  if (idx === -1) return { error: "Opera non trovata." };

  const priceRaw = formData.get("price") as string;
  artworks[idx] = {
    ...artworks[idx],
    title: (formData.get("title") as string)?.trim() ?? artworks[idx].title,
    subtitle: (formData.get("subtitle") as string)?.trim() ?? "",
    description: (formData.get("description") as string)?.trim() ?? "",
    year: parseInt(formData.get("year") as string) || artworks[idx].year,
    dimensions: (formData.get("dimensions") as string)?.trim() ?? "",
    technique: (formData.get("technique") as string)?.trim() ?? "",
    category: (formData.get("category") as ArtworkCategory) ?? artworks[idx].category,
    available: formData.get("available") === "true",
    price: priceRaw ? parseInt(priceRaw) : undefined,
    images: [(formData.get("image") as string)?.trim() || artworks[idx].images[0]],
  };

  await writeArtworks(artworks);
  revalidatePath("/galleria");
  revalidatePath(`/galleria/${slug}`);
  revalidatePath("/");
  redirect("/admin/prodotti");
}

export async function deleteArtwork(slug: string) {
  const artworks = await readArtworks();
  await writeArtworks(artworks.filter((a) => a.slug !== slug));
  revalidatePath("/galleria");
  revalidatePath("/");
  revalidatePath("/admin/prodotti");
}
