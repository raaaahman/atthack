import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

import { DialogueComponent } from "../../components/dialogue/DialogueComponent";
import { SCREEN_PREFIX } from "./-constants";
import { useCharacters } from "@/contexts/CharactersContext";
import { useDialogue } from "@/contexts/DialogueContext";

export const Route = createFileRoute("/contacts/$contactId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contactId } = useParams({ from: "/contacts/$contactId" });
  const { state, advance } = useDialogue({ screen: SCREEN_PREFIX + contactId });
  const characters = useCharacters();

  return (
    <>
      <header className="fixed bg-base-100 w-full h-16 z-[5] flex justify-between md:justify-center items-center p-2">
        <Link href="/contacts" className="block md:hidden">
          <span className="sr-only">Other Contacts</span>
          <ChevronLeftIcon
            title="Other Contacts"
            role="presentation"
            className="btn btn-circle bg-base-100 border border-base-300"
          />
        </Link>
        <h1 className="p-2 text-lg shadow-sm">
          Your conversation with{" "}
          <span className="font-semibold">{characters.getName(contactId)}</span>
        </h1>
      </header>

      <DialogueComponent
        state={state}
        advance={advance}
        className="container mx-auto pt-16"
      />
    </>
  );
}
