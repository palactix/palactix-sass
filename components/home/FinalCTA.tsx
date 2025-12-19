import { Button } from "@/components/ui/button";
import { Container } from "../Container";
import Link from "next/link";

export function FinalCTA() { 
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop losing clients to third-party consent screens
          </h2>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
            asChild
          >
            <Link href="/auth/signup">Get started with Palactix</Link>
          </Button>

          <p className="text-sm text-muted-foreground">
            We&apos;ll even help you get your apps approved. Cancel anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}