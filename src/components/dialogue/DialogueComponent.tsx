import { useEffect, useState } from "react";
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
  const [result, setResult] = useState<Immutable<
    Partial<TextResult | OptionsResult | CommandResult>
  > | null>(snap.currentResult);

  // autorun
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!snap.currentResult) {
      setResult(null);
    } else if ("command" in snap.currentResult) {
      if (snap.currentResult.command.startsWith("wait")) {
        setResult(null);

        setTimeout(
          () => {
            advance();
          },
          parseInt(
            snap.currentResult.command.match(/wait\s(\d+)/)?.at(1) || "1"
          ) * 1000
        );
      }
    } else {
      const isPlayer = snap.currentResult?.markup?.find(
        (tag) =>
          tag.name === "character" &&
          tag.properties.name.toLowerCase() === PLAYER_ID
      );
      setResult(
        isPlayer
          ? null
          : {
              ...snap.currentResult,
              text: "",
            }
      );
      timeout = setTimeout(
        () => {
          setResult(snap.currentResult);
          if (
            snap.currentResult &&
            !("options" in snap.currentResult) &&
            !snap.currentResult.isDialogueEnd
          )
            advance();
        },
        (snap.currentResult?.text?.length || 20) * 25
      );
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [advance, snap.currentResult]);

  return (
    <div className="flex-grow flex flex-col justify-between bg-neutral-300">
      <ul className="overflow-y-scroll">
        {(
          snap.history.filter((result) => "text" in result) as Immutable<
            OptionsResult | TextResult
          >[]
        ).map((result, i) => (
          <ChatMessage key={result.metadata.screen + "-" + i} result={result} />
        ))}
        {result && !("options" in result) && !("command" in result) ? (
          <ChatMessage
            key={
              (result.metadata?.screen || "dialogue") +
              "-" +
              snap.history.length
            }
            result={result}
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
