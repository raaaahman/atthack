import { useEffect, useLayoutEffect, useState } from "react";
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

interface DialogueComponentProps {
  state: Pick<YarnBound, "history" | "currentResult">;
  advance: YarnBound["advance"];
}

export function DialogueComponent({ state, advance }: DialogueComponentProps) {
  const snap = useSnapshot(state);
  const [currentResult, setCurrentResult] = useState<Immutable<
    Partial<TextResult | OptionsResult | CommandResult>
  > | null>(snap.currentResult);

  const isPlayer = snap.currentResult?.markup?.find(
    (tag) =>
      tag.name === "character" &&
      tag.properties.name.toLowerCase() === PLAYER_ID
  );

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
        },
        (snap.currentResult?.text?.length || 20) * 25
      );
    }

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
      className="flex-grow flex flex-col justify-between bg-neutral-300"
      onClick={handleClick}
    >
      <ul className="w-full overflow-y-scroll">
        {(
          snap.history.filter((result) => "text" in result) as Immutable<
            OptionsResult | TextResult
          >[]
        ).map((result, i) => (
          <ChatMessage key={result.metadata.screen + "-" + i} result={result} />
        ))}
        {currentResult &&
        !("options" in currentResult) &&
        !("command" in currentResult) ? (
          <ChatMessage
            key={
              (currentResult.metadata?.screen || "dialogue") +
              "-" +
              snap.history.length
            }
            result={currentResult}
          />
        ) : null}
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
