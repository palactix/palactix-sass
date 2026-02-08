import { Container } from "@/components/Container";

export default function ListingLayout(
  { 
    children,
    breadcrumbs,
    header,
    filters
   }: 
  { 
    children: React.ReactNode,
    breadcrumbs?: React.ReactNode,
    header?: React.ReactNode,
    filters?: React.ReactNode
  }) {
  return (
    <Container className="container py-10">
      {breadcrumbs && breadcrumbs}
      <div className="space-y-6">
        {header && header}
        {filters && filters}
        {children}
      </div>
    </Container>
  );
}