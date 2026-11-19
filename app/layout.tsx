import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genius Lab Jr. Studio",
  description: "Create, review, and prepare family-friendly Genius Lab Jr. episodes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
