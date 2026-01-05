import { StaticPageShell, useStaticContent } from "@/features/static-content";
import { STATIC_PAGES_CONTENT_URLS } from "@/utils/static-content/routes";

const GDPR_URL = STATIC_PAGES_CONTENT_URLS.GDPR;

export default function GdprPage() {
  const { content } = useStaticContent({ url: GDPR_URL });
  return (
    <StaticPageShell
      backHref="/"
      backLabel="Back to home"
      eyebrow="Legal"
      title="GDPR"
      description="Transparency around how Palactix handles your data."
    >
      {content}
    </StaticPageShell>
  );
}