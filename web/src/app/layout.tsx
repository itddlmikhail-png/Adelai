import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import { AppChrome } from "../components/AppChrome";
import { AuthProvider } from "../components/AuthProvider";
import "./globals.css";

const display = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Adelai — AI Operating System",
  description:
    "Adelai is the place where people think, build, organize and create with AI. Everything lives inside Projects. Every Project has its own memory.",
  openGraph: {
    title: "Adelai — AI Operating System",
    description:
      "A calm, project-first AI workspace. Apple precision. Cursor intent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-ink text-white antialiased">
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
