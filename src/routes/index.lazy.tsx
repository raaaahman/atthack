import { createLazyFileRoute } from "@tanstack/react-router";

import { DialogueComponent } from "@/components/DialogueComponent";
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
      {state && advance ? (
        <DialogueComponent state={state} advance={advance} />
      ) : (
        <div className="flex-grow flex justify-center items-center">
          <div className="loading loading-spinner loading-lg">
            <span className="sr-only">Loading</span>
          </div>
        </div>
      )}
    </>
  );
}
