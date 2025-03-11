import {
  ChatBubbleOvalLeftIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { useSnapshot } from "valtio";

import { Notify } from "@/components/notifications/Notify";
import { useDialogue } from "@/contexts/DialogueContext";

export const Navbar = () => {
  const { state } = useDialogue({});
  const snap = useSnapshot(state);

  return (
    <nav className="menu bg-base-100 h-full flex flex-col z-[12]">
      <Link to="/" className="btn btn-square btn-neutral m-1 p-1">
        <span className="sr-only">Home</span>
        <HomeIcon title="Home" role="presentation" />
      </Link>
      <Notify route="/contacts" result={snap.currentResult}>
        <Link className="btn btn-square btn-neutral m-1 p-1" to="/contacts">
          <span className="sr-only">Messages</span>
          <ChatBubbleOvalLeftIcon title="Messages" role="presentation" />
        </Link>
      </Notify>
      <Notify route="/ai" result={snap.currentResult}>
        <Link
          className="btn btn-square btn-neutral m-1 p-1"
          to="/ai/$modelId"
          params={{ modelId: "flemmy" }}
        >
          <span className="sr-only">AI Assistant</span>
          <SparklesIcon title="AI Assistant" role="presentation" />
        </Link>
      </Notify>
      <Link to="/settings" className="btn btn-square btn-neutral m-1 p-1">
        <span className="sr-only">Settings</span>
        <WrenchScrewdriverIcon title="Settings" role="presentation" />
      </Link>
    </nav>
  );
};
