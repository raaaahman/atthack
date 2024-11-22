import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { DialogueComponent } from "../../components/DialogueComponent";
import { SCREEN_PREFIX } from "./-constants";
import { useCharacters } from "@/contexts/CharactersContext";

export const Route = createLazyFileRoute("/contacts/$contactId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contactId } = useParams({ from: "/contacts/$contactId" });
  const characters = useCharacters();

  return (
    <>
      <h1 className="p-4 text-lg shadow-sm">
        Your conversation with{" "}
        <span className="font-semibold">{characters.getName(contactId)}</span>
      </h1>
      <DialogueComponent screen={SCREEN_PREFIX + contactId} />
    </>
  );
}
