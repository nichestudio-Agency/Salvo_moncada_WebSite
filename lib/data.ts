import { promises as fs } from "fs";
import path from "path";
import type { Artwork } from "./artworks";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readArtworks(): Promise<Artwork[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, "artworks.json"), "utf8");
  return JSON.parse(raw);
}

export async function writeArtworks(artworks: Artwork[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "artworks.json"),
    JSON.stringify(artworks, null, 2)
  );
}

export type Order = {
  id: string;
  nome: string;
  email: string;
  scena: string;
  dimensione?: string;
  budget?: string;
  messaggio?: string;
  status: "nuovo" | "in-lavorazione" | "completato";
  createdAt: string;
};

export async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "orders.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, "orders.json"),
    JSON.stringify(orders, null, 2)
  );
}
