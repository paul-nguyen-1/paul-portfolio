import { createFileRoute } from "@tanstack/react-router";
import CreateUser from "../components/createUser";

export const Route = createFileRoute("/createUser")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreateUser />;
}
