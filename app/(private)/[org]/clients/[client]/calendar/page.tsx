
type PageProps = {
  params: {
    client: string
  }
}
export default function ClientCalendarPage({ params }: PageProps) {
  console.log(params);
  const clientId = params.client as string;

  return (
    <div>
      <h1>Client Calendar Page for Client ID: {clientId}</h1>
      {/* Calendar component would go here */}
    </div>
  );
}