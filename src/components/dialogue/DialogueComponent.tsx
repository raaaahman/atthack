import {
  ComponentProps,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useSnapshot } from "valtio";
import YarnBound, {
  CommandResult,
  OptionsResult,
  TextResult,
} from "yarn-bound";

import { Immutable } from "@/types/Immutable";
import { ChatMessage } from "./ChatMessage";
import { PLAYER_ID } from "@/constants";
import { ChatInput } from "./ChatInput";
import clsx from "clsx";

interface DialogueComponentProps {
  state: Pick<YarnBound, "history" | "currentResult">;
  advance: YarnBound["advance"];
}

export function DialogueComponent({
  state,
  advance,
  className,
  ...props
}: ComponentProps<"div"> & DialogueComponentProps) {
  const snap = useSnapshot(state);
  const [currentResult, setCurrentResult] = useState<Immutable<
    TextResult | OptionsResult | CommandResult
  > | null>(snap.currentResult);

  const isPlayer = snap.currentResult?.markup?.find(
    (tag) =>
      tag.name === "character" &&
      tag.properties.name.toLowerCase() === PLAYER_ID
  );

  const messagesListRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    setCurrentResult(
      !snap.currentResult ||
        isPlayer ||
        "command" in snap.currentResult ||
        "options" in snap.currentResult
        ? null
        : !snap.currentResult.markup?.find((tag) => tag.name === "character")
          ? snap.currentResult
          : {
              ...snap.currentResult,
              text: "",
            }
    );
  }, [snap.currentResult, isPlayer]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (
      snap.currentResult &&
      !("command" in snap.currentResult) &&
      !("options" in snap.currentResult) &&
      snap.currentResult.markup?.find((tag) => tag.name === "character") &&
      !isPlayer
    ) {
      timeout = setTimeout(
        () => {
          setCurrentResult(snap.currentResult);
          messagesListRef.current?.scrollTo({
            top: messagesListRef.current.scrollHeight,
            behavior: "smooth",
          });
        },
        (snap.currentResult?.text?.length || 20) * 25
      );
    }
    messagesListRef.current?.scrollTo({
      top: messagesListRef.current.scrollHeight,
      behavior: "smooth",
    });
    return () => {
      clearTimeout(timeout);
    };
  }, [advance, snap.currentResult, isPlayer]);

  const handleClick = () => {
    if (isPlayer || (currentResult && currentResult === snap.currentResult))
      advance();
  };

  return (
    <div
      className={clsx("h-full flex flex-col bg-neutral-300", className)}
      onClick={handleClick}
      {...props}
    >
      <ul
        ref={messagesListRef}
        className="grow overflow-y-scroll scroll-smooth"
      >
        {snap.history
          .concat(
            currentResult &&
              !("options" in currentResult) &&
              !("command" in currentResult)
              ? currentResult
              : []
          )
          .map((result, i) =>
            "text" in result ? (
              <ChatMessage
                key={result.metadata.screen + "-" + i}
                result={result}
              />
            ) : null
          )}
      </ul>
      <ChatInput
        key={
          (snap.currentResult?.metadata?.screen || "dialogue") +
          "-input-" +
          snap.history.length
        }
        result={snap.currentResult}
        advance={advance}
      />
    </div>
  );
}