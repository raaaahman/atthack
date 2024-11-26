import { createLazyFileRoute } from "@tanstack/react-router";

import { DialogueComponent } from "@/components/dialogue/DialogueComponent";
import { useDialogue } from "@/contexts/DialogueContext";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { state, advance } = useDialogue({ screen: "home" });

  return (
    <>
      <h1 className="text-2xl font-bold text-center shadow-sm p-4 bg-neutral-100">
        Home
      </h1>
      <DialogueComponent state={state} advance={advance} />
    </>
  );
}
