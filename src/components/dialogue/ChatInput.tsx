import { useRef, useState } from "react";
import YarnBound from "yarn-bound";
import clsx from "clsx";

import { useVariableStorage } from "@/contexts/VariableStorageContext";
import { Immutable } from "@/types/Immutable";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import { PLAYER_ID } from "@/constants";

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

    if (formData.has("prompt")) {
      variables.set(
        formData.get("variable-name")?.toString() || "user_input",
        formData.get("prompt")!.toString()
      );
      advance();
    }
  };

  const isFromPlayer =
    result &&
    "text" in result &&
    result.markup?.find(
      (tag) =>
        tag.name === "character" &&
        tag.properties.name.toLowerCase() === PLAYER_ID
    );
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-lg m-auto "
    >
      {result && "options" in result ? (
        <>
          <input type="hidden" name="option" value={-1} />
          <div className="flex flex-row flex-wrap chat-end justify-start">
            {result.options.map((option, index) => (
              <button
                className={clsx(
                  "basis-1/2 chat-bubble hover:chat-bubble-primary",
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
            isValidInput
              ? "btn-secondary text-secondary-content"
              : "btn-disabled text-neutral-content"
          )}
          disabled={!isValidInput}
        >
          <EnvelopeIcon title="Send" role="presentation" />
        </button>
      </div>
    </form>
  );
}
