import { createElement, ReactNode } from "react";
import clsx from "clsx";
import { OptionsResult, TextResult } from "yarn-bound";

import { PLAYER_ID } from "@/constants";
import { useCharacters } from "@/contexts/CharactersContext";
import { Avatar } from "@/components/Avatar";
import MARKUP from "@/components/markup";
import { Immutable } from "@/types/Immutable";

interface ChatMessageProps {
  result: Immutable<Partial<TextResult> | OptionsResult>;
}

export function ChatMessage({ result }: ChatMessageProps) {
  const characterTag = result.markup?.find((tag) => tag.name === "character");
  const characterId = characterTag?.properties.name.toLowerCase();

  const characters = useCharacters();

  let content: ReactNode[] = [result.text || ""];

  result.markup?.forEach((tag) => {
    if (!Object.getOwnPropertyNames(MARKUP).includes(tag.name)) return;

    let currentLength = 0;
    content = content.reduce<ReactNode[]>((all, current) => {
      if (!current) return all;

      const previousLength = currentLength;
      const primitive = String(current);
      currentLength += primitive.length;

      if (currentLength > tag.position) {
        const before = primitive.slice(0, tag.position - previousLength);

        const inner = primitive.slice(
          tag.position - previousLength,
          tag.position - previousLength + tag.length
        );

        const after = primitive.slice(
          tag.position - previousLength + tag.length
        );

        const Component = MARKUP[tag.name as keyof typeof MARKUP];

        return all.concat(
          before.trim().length > 0 ? (
            <span key={previousLength}>{before}</span>
          ) : undefined,
          createElement(
            Component,
            { ...tag.properties, key: tag.position },
            inner
          ),
          after.trim().length > 0 ? (
            <span key={tag.position + tag.length}>{after}</span>
          ) : undefined
        );
      } else {
        return all.concat(current);
      }
    }, []);
  });
  const isPlayer = characterId === PLAYER_ID;

  const isFlipped =
    isPlayer || result.markup?.find((tag) => tag.name === "inside");

  return (
    <li
      className={clsx(
        "chat py-2 px-4",
        isFlipped ? "chat-end" : "chat-start",
        result.markup?.find((tag) => tag.name === "inside")
          ? "bg-neutral-400 shadow-v shadow-neutral-400"
          : undefined
      )}
    >
      <div className="chat-image avatar flex">
        {characterTag?.properties.as ? (
          <Avatar
            characterId={characterTag.properties.as.toLocaleLowerCase()}
            className={clsx("relative", isFlipped ? "-me-4" : "order-1 -ms-4")}
          />
        ) : null}
        {characterId && (isPlayer || !characterTag?.properties.as) ? (
          <Avatar characterId={characterId} />
        ) : null}
      </div>
      {characterId ? (
        <div className="chat-header">
          {characterTag?.properties.as
            ? characterTag.properties.as +
              (characterId === PLAYER_ID
                ? ` (${characters.getName(characterId)})`
                : "")
            : characters.getName(characterId)}
        </div>
      ) : null}
      <div
        className={clsx(
          result.markup?.find((tag) => tag.name === "inside")
            ? undefined
            : "chat-bubble transition-[width]",
          isPlayer ? "chat-bubble-primary" : ""
        )}
      >
        {content.length > 0 ? (
          content
        ) : (
          <span
            className={clsx(
              "loading loading-dots loading-md",
              isPlayer ? "text-neutral-content" : "text-primary-content"
            )}
          />
        )}
      </div>
    </li>
  );
}
