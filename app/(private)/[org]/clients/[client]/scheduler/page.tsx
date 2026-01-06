
import SchedulerPage from "@/components/scheduler/SchedulerPage";

type PageProps = {
  params: {
    client: string
  }
}

export default function ClientSchedulerPage({ params }: PageProps) {
 
  const clientId = params.client as string;

  return (
    <SchedulerPage clientId={clientId} />
  );
}
