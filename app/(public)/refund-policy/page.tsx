import { StaticPageShell, useStaticContent } from "@/features/static-content";
import { STATIC_PAGES_CONTENT_URLS } from "@/utils/static-content/routes";

const REFUND_POLICY_URL = STATIC_PAGES_CONTENT_URLS.REFUND_POLICY
export const revalidate = 86400;

export default function RefundPolicyPage() {
  const { content } = useStaticContent({ url: REFUND_POLICY_URL, revalidate });
  return (
    <StaticPageShell
      backHref="/"
      backLabel="Back to home"
      eyebrow="Legal"
      title="Refund Policy"
      description="Transparency around how Palactix handles your data."
    >
      {content}
    </StaticPageShell>
  );
}