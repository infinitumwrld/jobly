import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSet",
  description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
  icons: {
    icon: '/favi.png'
  },

  openGraph: {
    title: "SkillSet",
    description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
    url: "https://skill-set.ai", // important for some platforms
    siteName: "SkillSet",
    images: [
      {
        url: "https://skill-set.ai/ogimage.png", // your actual OG image
        width: 1200,
        height: 630,
        alt: "SkillSet - AI Interview Prep",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillSet",
    description: "Get job-ready faster with realistic AI interviews and expert feedback — built for Tech and CS roles.",
    images: 'https://skill-set.ai/mobileshare.png',
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}

        <Toaster /> 
      </body>
    </html>
  );
}