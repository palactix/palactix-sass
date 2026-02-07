import { StaticPageShell, getStaticContent } from "@/features/static-content";
import { headers } from "next/headers";
import { STATIC_PAGES_CONTENT_URLS } from "@/utils/static-content/routes";
import { Metadata } from "next";
import Script from "next/script";

const title = "Why Palactix Exists: Agencies Should Own Their Infrastructure";
const description =
  "The manifesto behind Palactix — why social media agencies should own their publishing infrastructure, not rent it from vendors.";
const imageUrl = "https://www.palactix.com/images/why-palactix-exists.jpeg";
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    images: [imageUrl]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

const WHY_PALACTIX_URL = STATIC_PAGES_CONTENT_URLS.WHY_PALACTIX_EXISTS;
export const revalidate = 86400;

export default async function WhyPalactixExistsPage() {
  const { content } = await getStaticContent({ url: WHY_PALACTIX_URL, revalidate });
  // Determine back href from Referer header when available, otherwise fallback to '/'
  const headersList = await headers();
  const referer = headersList.get('referer');
  const backHref = referer || "/";
  

  return (
    <StaticPageShell
      backHref={backHref}
      backLabel="Back"
      eyebrow=""
      title="Why Palactix Exists"
      description="Transparency around why Palactix exists and our mission."
    >
       <PalactixWhySchema title={title} description={description} />
      {content}
    </StaticPageShell>
  );
}


function PalactixWhySchema({ title, description }: { title: string; description: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.palactix.com/#organization",
        "name": "Palactix",
        "url": "https://www.palactix.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.palactix.com/og.png"
        },
        "sameAs": [
          "https://www.linkedin.com/company/palactix",
          "https://twitter.com/palactix"
        ]
      },

      {
        "@type": "WebSite",
        "@id": "https://www.palactix.com/#website",
        "url": "https://www.palactix.com",
        "name": "Palactix",
        "publisher": {
          "@id": "https://www.palactix.com/#organization"
        }
      },

      {
        "@type": "WebPage",
        "@id": "https://www.palactix.com/why-palactix-exists#webpage",
        "url": "https://www.palactix.com/why-palactix-exists",
        "name": title,
        "description": description,
        "isPartOf": {
          "@id": "https://www.palactix.com/#website"
        },
        "about": {
          "@id": "https://www.palactix.com/#organization"
        }
      },

      {
        "@type": "Article",
        "@id": "https://www.palactix.com/why-palactix-exists#article",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Person",
          "name": "Jitendra Meena"
        },
        "publisher": {
          "@id": "https://www.palactix.com/#organization"
        },
        "mainEntityOfPage": {
          "@id": "https://www.palactix.com/why-palactix-exists#webpage"
        },
        "datePublished": "2026-02-07",
        "dateModified": "2026-02-07",
        "image": {
          "@type": "ImageObject",
          "url": "https://www.palactix.com/images/why-palactix-exists-og.png"
        }
      },

      {
        "@type": "BreadcrumbList",
        "@id": "https://www.palactix.com/why-palactix-exists#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.palactix.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Why Palactix Exists",
            "item": "https://www.palactix.com/why-palactix-exists"
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="palactix-why-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}