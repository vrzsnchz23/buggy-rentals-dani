import type { MetadataRoute } from "next";
import { VEHICLES } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Buggy Rentals with Dani — Cozumel",
    short_name: "Buggy with Dani",
    description:
      `Rent an open-air buggy or sedan in Cozumel. From $${VEHICLES.compact.price}/day per vehicle, insurance included, steps from the cruise terminals.`,
    start_url: "/en",
    display: "standalone",
    background_color: "#F5F0EB",
    theme_color: "#1B4F72",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
