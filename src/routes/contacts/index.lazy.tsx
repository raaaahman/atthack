import {
  createLazyFileRoute,
  Link,
  useLoaderData,
} from "@tanstack/react-router";
import {
  ChatBubbleOvalLeftIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import { Avatar } from "@/components/Avatar";
import { useDialogue } from "@/contexts/DialogueContext";
import { SCREEN_PREFIX } from "./-constants";
import { PLAYER_ID } from "@/constants";

export const Route = createLazyFileRoute("/contacts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useLoaderData({ from: "/contacts/" });
  const { state } = useDialogue({});

  return (
    <>
      <header className="fixed w-full z-[5] h-16 p-2 bg-base-100 flex justify-between md:justify-center items-center">
        <Link href="/" className="block md:hidden">
          <span className="sr-only">Back Home</span>
          <ChevronLeftIcon
            title="Back Home"
            role="presentation"
            className="btn btn-circle bg-base-100 border-base-300"
          />
        </Link>
        <h1 className="text-2xl font-bold text-center p-2 shadow-sm">
          Contacts
        </h1>
        <div className="w-12 md:hidden" />
      </header>
      <ul className="container mx-auto bg-neutral-300 px-4 flex-grow mt-16">
        {data.map(({ id, name, role }) => (
          <li
            key={id}
            className="flex flex-row justify-between rounded-full shadow-md my-2 p-2 bg-neutral-100"
          >
            <Avatar characterId={id} />
            <div className="flex-grow text-start px-1">
              <p className="font-semibold">{name}</p>
              <p className="font-light">{role}</p>
            </div>
            <div className="indicator">
              {state.currentResult?.metadata.screen.slice(
                SCREEN_PREFIX.length
              ) === id &&
              !("options" in state.currentResult) &&
              !("command" in state.currentResult) &&
              !state.currentResult?.markup?.find(
                (tag) =>
                  tag.name === "character" &&
                  tag.properties.name.toLowerCase() === PLAYER_ID
              ) ? (
                <span className="indicator-item badge badge-secondary text-secondary-content">
                  1
                </span>
              ) : null}
              <Link
                to={`/contacts/${id}`}
                className="btn btn-circle btn-primary p-1 size-12"
              >
                <span className="sr-only">Chat</span>
                <ChatBubbleOvalLeftIcon
                  role="presentation"
                  title="Chat"
                  className=""
                />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
