import { CheckCircle2, XCircle } from "lucide-react";
import { Container } from "../Container";

export function HonestySection() {
  const weNail = [
    "White-label scheduling",
    "True BYO keys",
    "Unlimited clients flat pricing",
  ];

  const weDontHaveYet = [
    "Social listening/inbox",
    "Advanced comment moderation",
    "Built-in analytics",
  ];

  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {`What we do & don't do`}
          </h2>
          <p className="text-lg text-muted-foreground">
            We believe in radical transparency
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* We Nail Card */}
          <div className="bg-primary/5 border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">We nail</h3>
            </div>

            <ul className="space-y-4">
              {weNail.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* We Don't Have Yet Card */}
          <div className="bg-muted/50 border-2 border-border rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <XCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">{`We don't have yet`}</h3>
            </div>

            <ul className="space-y-4">
              {weDontHaveYet.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-base text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Roadmap coming soon. We ship fast based on agency feedback.
              </p>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="mt-20 border-t border-border" />
      </Container>
    </section>
  );
}
