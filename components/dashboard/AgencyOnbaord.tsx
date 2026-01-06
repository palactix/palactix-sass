import Link from "next/link";
import { Button } from "../ui/button";
import { buildOrgUrl } from "@/lib/utils/org-urls";

export default function AgencyOnboard() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold mb-1">Create Your Agency App</h3>
                <p className="text-green-50/90 max-w-xl">
                    Takes 4 minutes. After this, your clients will only see YOUR agency name on Instagram, TikTok, etc. No more third-party branding.
                </p>
            </div>
            <Button size="lg" variant="secondary" className="font-semibold whitespace-nowrap hover:bg-white hover:text-green-700" asChild>
                <Link href={buildOrgUrl('/agency-app')}>Get Started</Link>
            </Button>
        </div>
        {/* Decorative circle */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      </div>
  )
}