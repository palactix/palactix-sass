
import SchedulerPage from "@/components/scheduler/SchedulerPage";

type PageProps = {
  params: {
    client: string
  }
}

export default async function ClientSchedulerPage({ params }: PageProps) {
 
  const { client } = await params;

  return (
    <SchedulerPage clientId={client} />
  );
}
