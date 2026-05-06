"use client";

import Navbar from "./Navbar";
import Cursor from "@/components/ui/Cursor";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <Navbar />
      {children}
    </>
  );
}
