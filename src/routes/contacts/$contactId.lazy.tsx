import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { DialogueComponent } from "../../components/dialogue/DialogueComponent";
import { SCREEN_PREFIX } from "./-constants";
import { useCharacters } from "@/contexts/CharactersContext";
import { useDialogue } from "@/contexts/DialogueContext";

export const Route = createLazyFileRoute("/contacts/$contactId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contactId } = useParams({ from: "/contacts/$contactId" });
  const { state, advance } = useDialogue({ screen: SCREEN_PREFIX + contactId });
  const characters = useCharacters();

  return (
    <>
      <h1 className="p-4 text-lg shadow-sm">
        Your conversation with{" "}
        <span className="font-semibold">{characters.getName(contactId)}</span>
      </h1>
      <DialogueComponent state={state} advance={advance} />
    </>
  );
}
