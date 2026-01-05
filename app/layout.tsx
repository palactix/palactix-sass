import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/home/ThemeProvider";
import { Providers } from "@/components/Providers";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Palactix - White-Label Social Publishing Platform for Agencies",
  description: "Run your own white-label social publishing platform by using your agency’s own app credentials for client publishing across major social platforms.",

  keywords: [
    "social media scheduler for agencies",
    "white label social publishing",
    "BYO social media scheduler",
    "agency social media platform",
    "social media APIs for agencies",
  ],

  openGraph: {
    title: "Palactix",
    description:
      "Social Publishing Built for Agencies Using Their Own Apps.",
    url: "https://www.palactix.com",
    siteName: "Palactix",
    images: [
      {
        url: "https://www.palactix.com/images/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Palactix — Social Publishing Built for Agencies Using Their Own Apps",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Palactix",
    description:
      "Social Publishing Built for Agencies Using Their Own Apps.",
    images: ["https://www.palactix.com/images/social-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
