import { PLAYER_ID } from "@/constants";
import { useDialogue } from "@/contexts/DialogueContext";
import { screenName } from "@/utils";
import { SparklesIcon, UserIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "@tanstack/react-router";
import clsx from "clsx";
import { useSnapshot } from "valtio";

export const Navbar = () => {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { state } = useDialogue({});
  const snap = useSnapshot(state);

  return (
    <nav className="btm-nav [position:static_!important;]">
      <button className={clsx(pathname === "/" ? "active" : "")}>
        <Link to="/">
          <span className="sr-only">Home</span>
          <HomeIcon
            title="Home"
            role="presentation"
            className="size-8 m-2 md:size-12 md:m-4"
          />
        </Link>
      </button>
      <button className={clsx(pathname === "/contacts" ? "active" : "")}>
        <div className="indicator">
          {!pathname.startsWith("/contacts") &&
          typeof snap.currentResult?.metadata.screen === "string" &&
          snap.currentResult.metadata.screen.startsWith(
            screenName("/contacts/") || "conversation_"
          ) &&
          snap.currentResult?.markup
            ?.find((tag) => tag.name === "character")
            ?.properties.name.toLowerCase() !== PLAYER_ID &&
          !("options" in snap.currentResult) &&
          !("command" in snap.currentResult) ? (
            <span className="indicator-item badge badge-secondary">1</span>
          ) : null}
          <Link className="block" to="/contacts">
            <span className="sr-only">Contacts</span>
            <UserIcon
              title="Contacts"
              role="presentation"
              className="size-8 m-2 md:size-12 md:m-4"
            />
          </Link>
        </div>
      </button>
      <button className={clsx(pathname === "/ai" ? "active" : "")}>
        <div className="indicator">
          {!pathname.startsWith("/ai") &&
          typeof snap.currentResult?.metadata.screen === "string" &&
          snap.currentResult.metadata.screen.startsWith(
            screenName("/ai/") || "ai_"
          ) &&
          snap.currentResult?.markup
            ?.find((tag) => tag.name === "character")
            ?.properties.name.toLowerCase() !== PLAYER_ID &&
          !("options" in snap.currentResult) &&
          !("command" in snap.currentResult) ? (
            <span className="indicator-item badge badge-secondary">1</span>
          ) : null}
          <Link className="block" href="/ai/flemmy">
            <span className="sr-only">AI Assistant</span>
            <SparklesIcon
              title="AI Assistant"
              role="presentation"
              className="size-8 m-2 md:size-12 md:m-4"
            />
          </Link>
        </div>
      </button>
    </nav>
  );
};
