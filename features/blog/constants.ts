const branch = "main";
//const branch = "20-day-11-white-label-20-why-your-logo-isnt-enough-anymore";

export const BLOG_CONFIG = {
  POSTS_PER_PAGE: 9,
  GITHUB_CONTENT_BASE_URL: `https://raw.githubusercontent.com/palactix/content/refs/heads/${branch}/blog`,
  GITHUB_API_BASE_URL: "https://api.github.com/repos/palactix/content/contents/blog?ref=" + branch,
  CACHE_REVALIDATE_SECONDS: 60 * 60, // 1 hour
  SUGGESTED_POSTS_COUNT: 3,
  EXCERPT_LENGTH: 150, // characters
} as const;



export const solutionMap = [
  {
    id: "economics",
    label: "The Economics",
    description: "Why agency margins collapse before anyone notices.",
    posts: [
      {
        slug: "how-agencies-quietly-bleed-money-managing-just-10-client-accounts-2026-reality.md",
        title: "How Agencies Quietly Bleed Money Managing Just 10 Client Accounts (2026 Reality)",
      },
      {
        slug: "the-success-tax-why-per-seat-saas-penalizes-agency-growth",
        title: "The Success Tax: Why Per-Seat SaaS Penalizes Agency Growth",
      },
      {
        slug: "the-headcount-trap-social-media-agencies",
        title: "The Headcount Trap: Why Hiring More People Doesn’t Fix Agency Chaos",
      },
      {
        slug: "diseconomies-of-scale-agency-software-costs-2026",
        title: "The Diseconomies of Scale: Why Your Software Bill Is Outgrowing Your Agency",
      },
      {
        slug: "the-math-of-scaling-per-seat-vs-flat-fee",
        title: "The Math of Scaling: Why Per-Seat Pricing Becomes a Growth Tax",
      },
    ],
  },

  {
    id: "infrastructure",
    label: "The Infrastructure",
    description: "Who actually owns your publishing layer.",
    posts: [
      {
        slug: "the-middleman-risk-social-media-infrastructure",
        title: "The Middleman Risk: Why Renting Your Social Media Infrastructure Is a Liability",
      },
      {
        slug: "sovereign-agency-renter-to-owner",
        title: "The Sovereign Agency: Moving from Renter to Owner",
      },
      {
        slug: "byo-api-model-non-technical-ceo-guide",
        title: "What Is a BYO API Model? (The Non-Technical CEO Guide)",
      },
    ],
  },

  {
    id: "control",
    label: "Control & Flow",
    description: "Why teams stay busy but nothing finishes.",
    posts: [
      {
        slug: "busy-but-nothing-finished-social-media-agencies",
        title: "The Real Reason Your Team Is Always Busy but Nothing Feels Finished",
      },
      {
        slug: "third-party-consent-screens-agency-lose-control",
        title: "Third-Party Consent Screens: Why Agencies Lose Control",
      },
    ],
  },

  {
    id: "whitelabel",
    label: "White-Label Reality",
    description: "Why branding without ownership fails at scale.",
    posts: [
      {
        slug: "white-label-2-0-beyond-the-logo",
        title: "White-Label 2.0: Why Your Logo Isn’t Enough Anymore",
      },
    ],
  },

  {
    id: "sovereignty",
    label: "Sovereignty & Longevity",
    description: "Why replaceability matters more than contracts.",
    posts: [
      {
        slug: "scaling-ceiling-social-media-agency-margins",
        title: "The Scaling Ceiling: Why Social Media Agency Margins Shrink",
      },
      {
        slug: "data-sovereignty-why-agencies-lose-control",
        title: "Data Sovereignty: Why Agencies Lose Control",
      },
    ],
  },
];