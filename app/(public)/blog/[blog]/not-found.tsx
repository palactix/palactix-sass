import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <Container>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileQuestion className="h-20 w-20 text-muted-foreground mb-6" />
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild size="lg">
            <Link href="/blog">
              Back to All Posts
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
