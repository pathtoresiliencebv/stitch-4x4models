import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Manrope } from "next/font/google";
import { OrganizationJsonLd } from "next-seo";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { absoluteUrl, defaultSiteDescription, defaultSiteTitle, jsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NLDZ4NR6XQ";
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";
const brandLogoUrl =
  "https://media.base44.com/images/public/699871557dfcaafa02868052/8ae82d41d_4x4models.png";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${defaultSiteTitle} | Premium 4x4 Off-Road Adventures`,
    template: `%s | ${defaultSiteTitle}`,
  },
  description: defaultSiteDescription,
  applicationName: defaultSiteTitle,
  authors: [{ name: "4x4models Editorial" }],
  generator: "4x4models.com",
  keywords: [
    "4x4",
    "off-road",
    "overlanding",
    "Toyota Land Cruiser",
    "Tacoma",
    "Hilux",
    "4Runner",
    "Jeep Wrangler",
    "Ford Bronco",
    "recovery gear",
    "suspension",
    "tires",
  ],
  category: "Automotive",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      nl: "/nl",
      "x-default": "/en",
    },
  },
  openGraph: {
    siteName: defaultSiteTitle,
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    title: `${defaultSiteTitle} | Premium 4x4 Off-Road Adventures`,
    description: defaultSiteDescription,
    images: [
      {
        url: absoluteUrl("/images/og-cover.jpg"),
        width: 1200,
        height: 630,
        alt: "4x4models — Off-road rigs, gear and field stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${defaultSiteTitle} | Premium 4x4 Off-Road Adventures`,
    description: defaultSiteDescription,
    images: [absoluteUrl("/images/og-cover.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: gscVerification
    ? {
        google: gscVerification,
      }
    : undefined,
  other: {
    "theme-color": "#0e0f12",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {gscVerification ? (
          <meta name="google-site-verification" content={gscVerification} />
        ) : null}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} font-body antialiased min-h-screen flex flex-col bg-surface text-on-surface`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }}
        />
        <OrganizationJsonLd
          name={defaultSiteTitle}
          url={absoluteUrl("/")}
          logo={brandLogoUrl}
        />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-tag" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { send_page_view: true });
gtag('config', '${gaMeasurementId}', { groups: '4x4models' });`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
