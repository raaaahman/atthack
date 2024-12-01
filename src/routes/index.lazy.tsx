import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { useDialogue } from "@/contexts/DialogueContext";
import { Notify } from "@/components/notifications/Notify";
import { useSnapshot } from "valtio";
import {
  ChatBubbleOvalLeftIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { state } = useDialogue({});
  const snap = useSnapshot(state);

  return (
    <>
      <header>
        <h1 className="sr-only">Home</h1>
      </header>
      <main className="h-full w-full">
        <ul className="h-full w-full flex flex-col md:flex-row justify-center md:justify-around items-center">
          <li className="py-4 text-center">
            <Notify route="/contacts" result={snap.currentResult}>
              <Link
                href="/contacts"
                className="btn btn-square btn-neutral text-neutral-content size-24 shadow-md shadow-neutral"
              >
                <span className="sr-only">Messages</span>
                <ChatBubbleOvalLeftIcon title="Messages" role="presentation" />
              </Link>
            </Notify>
          </li>
          <li className="py-4 text-center">
            <Notify route="/ai" result={snap.currentResult}>
              <Link
                href="/ai/flemmy"
                className="btn btn-square btn-neutral text-neutral-content size-24 shadow-md shadow-neutral"
              >
                <span className="sr-only">AI Assistant</span>
                <SparklesIcon title="AI Assistant" role="presentation" />
              </Link>
            </Notify>
          </li>
          <li className="py-4 text-center">
            <Link
              href="/settings"
              className="btn btn-square btn-neutral text-neutral-content size-24 shadow-md shadow-neutral"
            >
              <span className="sr-only">Settings</span>
              <WrenchScrewdriverIcon title="Settings" role="presentation" />
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}
