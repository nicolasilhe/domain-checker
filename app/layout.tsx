import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Vérificateur de Domaines",
  description: "Vérifiez la disponibilité des noms de domaine en temps réel",
  keywords: ["domaine", "whois", "vérification", "disponibilité", "dns"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1 container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
