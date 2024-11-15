import { createFileRoute } from "@tanstack/react-router";

import { loadDialogue } from "@/queries/loadDialogue";

export const Route = createFileRoute("/")({
  loader: ({ context }) => loadDialogue(context, "scripts/index.yarn"),
  staleTime: Infinity,
});
