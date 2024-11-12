import { createLazyFileRoute, useLoaderData } from "@tanstack/react-router";
import { useRef } from "react";
import { proxy } from "valtio";

import { DialogueComponent } from "@/components/DialogueComponent";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const dialogue = useLoaderData({ from: "/" });
  const state = useRef(proxy(dialogue)).current;

  return (
    <>
      <h1 className="text-2xl font-bold text-center shadow-sm p-4 bg-neutral-100">
        Home
      </h1>
      <DialogueComponent state={state} />
    </>
  );
}
