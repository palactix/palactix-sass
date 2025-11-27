import { StaticPageShell, useStaticContent } from "@/features/static-content";
import { STATIC_PAGES_CONTENT_URLS } from "@/utils/static-content/routes";

const COOKIE_POLICY_URL = STATIC_PAGES_CONTENT_URLS.COOKIE_POLICY;

export default function CookiePolicyPage() {
  const { content } = useStaticContent({ url: COOKIE_POLICY_URL });
  return (
    <StaticPageShell
      backHref="/"
      backLabel="Back to home"
      eyebrow="Legal"
      title="Cookie Policy"
      description="Transparency around how Palactix handles your data."
    >
      {content}
    </StaticPageShell>
  );
}