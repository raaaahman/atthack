import { useRef, useState } from "react";
import YarnBound from "yarn-bound";
import clsx from "clsx";

import { useVariableStorage } from "@/contexts/VariableStorageContext";
import { Immutable } from "@/types/Immutable";
import { PLAYER_ID } from "@/constants";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  result: Immutable<YarnBound["currentResult"]>;
  advance: YarnBound["advance"];
}

export function ChatInput({ result, advance }: ChatInputProps) {
  const variables = useVariableStorage();

  const [isValidInput, setIsValidInput] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.has("option"))
      advance(parseInt(formData.get("option") as string));
    else if (formData.has("prompt")) {
      variables.set(
        formData.get("variable-name")?.toString() || "user_input",
        formData.get("prompt")!.toString()
      );
      advance();
      setIsValidInput(false);
    }
  };

  const isFromPlayer =
    !!result &&
    "text" in result &&
    !!result.markup?.find(
      (tag) =>
        tag.name === "character" &&
        tag.properties.name.toLowerCase() === PLAYER_ID
    );
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full m-auto px-4">
      {result && "options" in result ? (
        <>
          <input type="hidden" name="option" value={-1} />
          <div className="max-w-xl mx-auto flex flex-row flex-wrap justify-start chat-end ">
            {result.options.map((option, index) => (
              <button
                className={clsx(
                  "basis-1/2 grow chat-bubble hover:chat-bubble-primary",
                  option.isAvailable ? "" : "hidden"
                )}
                key={option.text}
                onClick={() => {
                  if (option.isAvailable && formRef.current) {
                    formRef.current
                      .querySelector("[name=option]")
                      ?.setAttribute("value", index.toString());
                    formRef.current.requestSubmit();
                  }
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </>
      ) : null}
      <div className="flex  my-4 ">
        {result &&
        "command" in result &&
        result.command.startsWith("prompt") ? (
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
          <div
            className={clsx(
              "input input-bordered w-full min-h-12 overflow-x-scroll",
              isFromPlayer ? "input-primary" : "input-disabled"
            )}
          >
            <div className="w-fit">
              {isFromPlayer ? (
                <div
                  style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    "--ah-animate-duration":
                      ((result.text?.length || 0) * 25) / 1000 + "s",
                    "--ah-animate-steps": result.text?.length || 1,
                  }}
                  className="typewriter text-start my-1 mr-auto"
                >
                  {result.text}
                </div>
              ) : null}
            </div>
          </div>
        )}
        <button
          type="submit"
          className={clsx(
            "btn btn-circle size-12 p-2 ms-2",
            isValidInput || isFromPlayer
              ? "btn-primary text-primary-content"
              : "btn-disabled text-neutral-content"
          )}
          disabled={!isValidInput && !isFromPlayer}
        >
          <PaperAirplaneIcon title="Send" role="presentation" />
        </button>
      </div>
    </form>
  );
}
