import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import YarnBound, { OptionsResult, TextResult } from "yarn-bound";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import { Immutable } from "@/types/Immutable";
import { useVariableStorage } from "@/contexts/VariableStorageContext";
import { ChatMessage } from "./ChatMessage";

interface DialogueComponentProps {
  state: Pick<YarnBound, "history" | "currentResult">;
  advance: YarnBound["advance"];
}

export function DialogueComponent({ state, advance }: DialogueComponentProps) {
  const snap = useSnapshot(state);

  // autorun
  useEffect(() => {
    if (
      snap.currentResult &&
      !("options" in snap.currentResult) &&
      !("command" in snap.currentResult) &&
      !snap.currentResult.isDialogueEnd
    ) {
      const timeout = setTimeout(() => {
        advance();
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
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
        {snap.currentResult && "text" in snap.currentResult ? (
          <ChatMessage
            key={snap.currentResult.metadata.screen + "-" + snap.history.length}
            result={snap.currentResult}
          />
        ) : null}
      </ul>
      <ChatInput
        key={
          snap.currentResult?.metadata.screen + "-input-" + snap.history.length
        }
        result={snap.currentResult}
        advance={advance}
      />
    </div>
  );
}

interface ChatInputProps {
  result: Immutable<YarnBound["currentResult"]>;
  advance: YarnBound["advance"];
}

function ChatInput({ result, advance }: ChatInputProps) {
  const variables = useVariableStorage();
  const [isValidInput, setIsValidInput] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.has("option"))
      advance(parseInt(formData.get("option") as string));

    if (formData.has("prompt")) {
      variables.set(
        formData.get("variable-name")?.toString() || "user_input",
        formData.get("prompt")!.toString()
      );
      advance();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row gap-2 items-center py-4"
    >
      {result && "command" in result && result.command.startsWith("prompt") ? (
        <>
          <input
            type="text"
            name="prompt"
            className="input input-bordered input-primary w-full max-w-lg"
            placeholder="Type here."
            onChange={(event) => {
              setIsValidInput(event.target.value.length >= 1);
            }}
          />
          <input
            type="hidden"
            name="variable-name"
            value={result.command.match(/\$(\w+)/)?.at(1) || "user_input"}
          />
        </>
      ) : (
        <select
          name="option"
          aria-placeholder="Type here."
          className="input input-bordered w-full max-w-lg"
          disabled={!result || !("options" in result)}
          onChange={
            result && "options" in result
              ? (event) => {
                  setIsValidInput(
                    parseInt(event.target.value) < result.options.length
                  );
                }
              : undefined
          }
          defaultValue={-1}
        >
          <option disabled={true} value={-1}>
            {result && "options" in result ? "Pick an answer." : ""}
          </option>
          {result && "options" in result
            ? result.options.map((option, index) => (
                <option
                  className={clsx(option.isAvailable ? "" : "hidden")}
                  key={option.text}
                  value={index}
                  disabled={!option.isAvailable}
                >
                  {option.text}
                </option>
              ))
            : null}
        </select>
      )}
      <button
        type="submit"
        className={clsx(
          "btn btn-circle size-12",
          isValidInput ? "btn-primary" : "btn-disabled"
        )}
        disabled={!isValidInput}
      >
        <span className="sr-only">Send</span>
        <EnvelopeIcon role="presentation" title="Send" className="size-8" />
      </button>
    </form>
  );
}
