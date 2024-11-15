import { createFileRoute } from "@tanstack/react-router";
import { loadDialogue } from "@/queries/loadDialogue";

export const Route = createFileRoute("/contacts/$contactId")({
  loader: ({ context, params }) =>
    loadDialogue(context, `scripts/contact-${params.contactId}.yarn`),
  staleTime: Infinity,
});
