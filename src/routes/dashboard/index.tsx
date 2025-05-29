import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "~/utils/auth-client";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useSession();
  return (
    <div>
      <pre>{JSON.stringify(session.data, null, 2)}</pre>
    </div>
  );
}
