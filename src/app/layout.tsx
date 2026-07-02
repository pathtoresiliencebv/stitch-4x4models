import type { Metadata } from "next";
import Script from "next/script";
import { OrganizationJsonLd } from "next-seo";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";
import { absoluteUrl, defaultSiteTitle, jsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NLDZ4NR6XQ";
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";
const brandLogoUrl = absoluteUrl("/images/brand/logo.png");

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: "4x4models — kenniscentrum voor 4x4",
    template: `%s | 4x4models`,
  },
  description:
    "Onafhankelijk kenniscentrum over 4x4-modellen: merken, techniek en erfgoed. Artikelen, modellenoverzichten en specificaties.",
  applicationName: "4x4models",
  authors: [{ name: "4x4models Redactie" }],
  generator: "4x4models.com",
  keywords: [
    "4x4",
    "terreinwagen",
    "SUV",
    "off-road",
    "Land Rover",
    "Toyota",
    "Jeep",
    "Mercedes-Benz G",
    "INEOS Grenadier",
  ],
  category: "Automotive",
  alternates: {
    canonical: "/",
    languages: {
      nl: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    siteName: "4x4models",
    type: "website",
    locale: "nl_NL",
    url: absoluteUrl("/"),
    title: "4x4models — kenniscentrum voor 4x4",
    description:
      "Onafhankelijk kenniscentrum over 4x4-modellen: merken, techniek en erfgoed. Artikelen, modellenoverzichten en specificaties.",
    images: [
      {
        url: absoluteUrl("/images/og/og-1200x630.png"),
        width: 1200,
        height: 630,
        alt: "4x4models — kenniscentrum voor 4x4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "4x4models — kenniscentrum voor 4x4",
    description:
      "Onafhankelijk kenniscentrum over 4x4-modellen: merken, techniek en erfgoed. Artikelen, modellenoverzichten en specificaties.",
    images: [absoluteUrl("/images/og/og-1200x630.png")],
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
    "theme-color": "#fbfaf7",
    "format-detection": "telephone=no",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" }],
    apple: [{ url: "/images/brand/icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {gscVerification ? (
          <meta name="google-site-verification" content={gscVerification} />
        ) : null}
      </head>
      <body
        className="font-body antialiased min-h-screen flex flex-col bg-paper text-ink"
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
