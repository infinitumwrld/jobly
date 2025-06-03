import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "./components/ui/Toaster";

// Optimize font loading
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "SkillSet",
  description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
  icons: {
    icon: '/favi.png'
  },
  metadataBase: new URL('https://skill-set.ai'),
  openGraph: {
    title: "SkillSet",
    description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
    url: "https://skill-set.ai",
    siteName: "SkillSet",
    images: [
      {
        url: "/ogimage.png",
        width: 1200,
        height: 630,
        alt: "SkillSet - AI Interview Coaching",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSet",
    description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
    images: '/mobileshare.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preload"
          href="/favi.png"
          as="image"
        />
        <link
          rel="preconnect"
          href="https://skill-set.ai"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}