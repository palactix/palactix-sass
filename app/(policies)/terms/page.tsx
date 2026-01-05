import { StaticPageShell, useStaticContent } from "@/features/static-content";
import { STATIC_PAGES_CONTENT_URLS } from "@/utils/static-content/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Palactix",
  description:
    "View the Terms of Service for Palactix, outlining user responsibilities and platform policies."
};
const TERMS_OF_SERVICE_URL = STATIC_PAGES_CONTENT_URLS.TERMS_OF_SERVICE;

export default function TermsOfServicePage() {
  const { content } = useStaticContent({ url: TERMS_OF_SERVICE_URL });
  return (
    <StaticPageShell
      backHref="/"
      backLabel="Back to home"
      eyebrow="Legal"
      title="Terms of Service"
      description="Transparency around how Palactix handles your data."
    >
      {content}
    </StaticPageShell>
  );
}