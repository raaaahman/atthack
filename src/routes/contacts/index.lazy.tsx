import {
  createLazyFileRoute,
  Link,
  useLoaderData,
} from "@tanstack/react-router";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";

import { Avatar } from "@/components/Avatar";

export const Route = createLazyFileRoute("/contacts/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useLoaderData({ from: "/contacts/" });
  return (
    <>
      <h1 className="text-2xl font-bold text-center p-2 shadow-sm bg-neutral-100">
        Contacts
      </h1>
      <ul className="bg-neutral-300 px-4 flex-grow">
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
            <Link
              to={`/contacts/${id}`}
              className="btn btn-circle btn-primary p-1"
            >
              <span className="sr-only">Chat</span>
              <ChatBubbleOvalLeftIcon role="presentation" title="Chat" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
