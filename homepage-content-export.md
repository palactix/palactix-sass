# Palactix Homepage Content Map

This document outlines the content structure and layout representation for the Palactix homepage (`src/app/page.tsx`).

## 1. Navbar
**Representation**: Fixed top bar, transparent with blur effect.
- **Logo**: "Palactix" (Text, Bold)
- **Navigation Links**:
  - Pricing (Anchor link to #pricing)
  - Login (Link to /auth/login)
- **CTA Button**: "Start 14-day Agency Pilot" (Primary Color, Link to /auth/signup)

---

## 2. Hero Section
**Representation**: Split Layout (Left: Copy, Right: Visual Mockup).

### Left Column (Text Content)
- **Trust Badge**: "Zero Platform Bans Since Launch • Used by 1,000+ Accounts" (Pill shape, Primary color accent)
- **H1 Headline**: "Run your own **white-label** social publishing platform"
- **Subheadline**: "Your clients see only YOUR agency name on Instagram, TikTok, X, and LinkedIn. Zero third-party branding. Zero shared keys. Flat pricing."
- **Buttons**:
  - Primary: "Start 14-day Agency Pilot" (with Arrow icon)
  - Secondary: "See Pricing" (Ghost variant)
- **Microcopy**: "No credit card required for pilot."

### Right Column (Visual)
- **Mockup**: A simulated OAuth consent screen showing "Johnson Social Agency" (instead of a generic tool) asking for Instagram access.
- **Key Visual Cues**: "JA" logo, Green checkmarks, "Allow Access" button.

---

## 3. Supported Platforms
**Representation**: Full-width strip with a grid of icons.
- **Headline**: "Native publishing — fully supported today"
- **Grid Items**:
  - Instagram (Supported)
  - TikTok (Supported)
  - LinkedIn (Supported)
  - X (Twitter) (Supported)
  - Facebook (Supported)
  - YouTube (Grayed out/Not supported yet)

---

## 4. Pain Point Section
**Representation**: Split Layout (Left: Visual, Right: Copy). *Note: Visual is on Left on Desktop, Top on Mobile.*

### Left Column (Visual)
- **Mockup**: A "Hootsuite" consent screen asking for access.
- **Visual Overlay**: A large Red "X" and a jagged red circle around the "Hootsuite" name, indicating this is the "bad" experience.

### Right Column (Text Content)
- **H2 Headline**: "This screen costs agencies six-figure clients every single week"
- **Body Copy**: "Never again explain a third-party tool to a million-follower creator. When high-profile clients see a generic tool's name asking for permissions, trust erodes instantly. With Palactix, they only see **your brand**."

---

**[Separator Line]**

---

## 5. Comparison Table
**Representation**: Data Table with checkmarks/crosses.
- **Headline**: "Why agencies are switching"
- **Columns**: Platform, BYO Keys, Zero Leakage, White-label Dashboard, Unlimited Clients, Total Cost.

| Platform | BYO Keys | Zero Leakage | White-label | Unlimited Clients | Cost |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Hootsuite | ❌ | ❌ | ✅ | ❌ | $500–$2000+/mo |
| Sprout Social | ❌ | ❌ | ✅ | ❌ | $1000–$3000+/mo |
| Buffer | ❌ | ❌ | ❌ | ✅ | $250–$1200+/mo |
| Sendible | ❌ | ❌ | ✅ | ✅ | $700+/mo |
| SocialPilot | ❌ | ❌ | ✅ | ✅ | $400+/mo |
| Ayrshare | ✅ | ✅ | ❌ | ✅ | $600+/mo |
| **Palactix** | ✅ | ✅ | ✅ | ✅ | **$199 – $799 flat** |

*Note: Palactix row is highlighted with primary color background and a "95% of agencies switch here" badge.*

---

**[Separator Line]**

---

## 6. How It Works
**Representation**: 4-Step Horizontal Process Flow with Icons.
- **Headline**: "60-second start → permanent ownership"
- **Steps**:
  1. **Start instantly**: "5-day trial with our keys" (Icon: Zap)
  2. **Add your own keys**: "Before day 6, Guided templates ensure smooth setup" (Icon: Key)
  3. **Consent screen shows YOUR name**: "Zero trust issues" (Icon: ShieldCheck)
  4. **Scale unlimited clients**: "Flat pricing" (Icon: TrendingUp)

---

**[Separator Line]**

---

## 7. Pricing Section
**Representation**: 3-Column Card Grid.

### Plan 1: Starter
- **Price**: $199/mo
- **Target**: For growing agencies
- **Features**: Up to 5 team seats, 50 Clients, White-label Dashboard, BYO Keys Support.
- **CTA**: "Start 14-day Pilot"

### Plan 2: Pro (Highlighted/Popular)
- **Price**: $799/mo
- **Target**: For established agencies
- **Features**: Everything in Starter, Unlimited Clients, Unlimited team seats, Priority Support, Custom Domain.
- **CTA**: "Start 14-day Pilot" (Primary Button)

### Plan 3: Scale
- **Price**: $1,999+/mo
- **Target**: For large enterprises
- **Features**: Everything in Pro, Dedicated Account Manager, SLA, Custom Integrations, On-premise Option.
- **CTA**: "Book a call"

---

**[Separator Line]**

---

## 8. Honesty Section ("What we do & don't do")
**Representation**: Two contrasting cards (Pros vs Cons).

### Card 1: "We nail" (Pros)
- White-label scheduling
- True BYO keys
- Unlimited clients flat pricing

### Card 2: "We don’t have yet" (Cons)
- Social listening/inbox
- Advanced comment moderation
- Built-in analytics

---

**[Separator Line]**

---

## 9. FAQ Section
**Representation**: Accordion List (Expandable items).
*Note: Questions are bold. Active/Open item turns Primary Color.*

- **Q**: Will my clients ever see “Palactix” anywhere?
  - **A**: No. Once you add your own keys, your agency’s name appears everywhere...
- **Q**: Do I have to pay during the 14-day pilot?
  - **A**: No credit card required...
- **Q**: What happens on day 6 if I haven’t added my own keys yet?
  - **A**: Posting stops until you add them...
- **Q**: How long does app approval take on Instagram/Facebook/TikTok?
  - **A**: 4–10 days on average...
- **Q**: Can my team members each have their own login?
  - **A**: Yes — up to 5 team seats on Starter... Unlimited seats on Pro and Scale...
- **Q**: My clients are already connected to another tool... How seamless is the migration?
  - **A**: Extremely. Generate fresh OAuth link...
- **Q**: Where are the OAuth tokens stored...?
  - **A**: Encrypted at rest using AES-256...
- **Q**: If I ever leave Palactix, what happens to my clients and tokens?
  - **A**: You own your app keys — nothing is ever locked...

---

## 10. Footer
**Representation**: Centered text block with final CTA.
- **Headline**: "Stop losing clients to third-party consent screens"
- **CTA Button**: "Start 14-day Agency Pilot"
- **Subtext**: "We’ll even help you get your apps approved. Cancel anytime."
- **Bottom Links**: Privacy, Terms, Developers.
