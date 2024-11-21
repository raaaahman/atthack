import { createLazyFileRoute } from "@tanstack/react-router";

import { DialogueComponent } from "@/components/DialogueComponent";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center shadow-sm p-4 bg-neutral-100">
        Home
      </h1>
      <DialogueComponent screen="home" />
    </>
  );
}
