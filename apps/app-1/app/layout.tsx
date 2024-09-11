import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppBar } from "~/components/app-bar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build Your Own",
  description: "Turborepo template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            <AppBar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </Providers>
        </body>
    </html>
  );
}
