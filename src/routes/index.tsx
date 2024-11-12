import { createFileRoute } from "@tanstack/react-router";

import { loadDialogue } from "@/queries/loadDialogue";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    loadDialogue("scripts/index.yarn", {
      variableStorage: context.variables,
    }),
  staleTime: Infinity,
});
