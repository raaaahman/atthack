import { createElement, ReactNode } from "react";
import clsx from "clsx";
import { OptionsResult, TextResult } from "yarn-bound";

import { PLAYER_ID } from "@/constants";
import { useCharacters } from "@/contexts/CharactersContext";
import { Avatar } from "@/components/Avatar";
import MARKUP from "@/components/markup";
import { Immutable } from "@/types/Immutable";

interface ChatMessageProps {
  result: Immutable<TextResult | OptionsResult>;
}

export function ChatMessage({ result }: ChatMessageProps) {
  const tag = result.markup?.find((tag) => tag.name === "character");
  const characterId = tag?.properties.name.toLowerCase();

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

  return (
    <li
      className={clsx(
        "chat",
        characterId === PLAYER_ID ? "chat-end" : "chat-start"
      )}
    >
      {tag ? (
        <div className="chat-image avatar">
          {tag.properties.as ? (
            <Avatar
              characterId={tag.properties.as.toLocaleLowerCase()}
              className={clsx(
                "relative",
                characterId === PLAYER_ID ? "-me-4" : "-ms-4"
              )}
            />
          ) : null}
          <Avatar characterId={tag.properties.name.toLocaleLowerCase()} />
        </div>
      ) : null}
      {characterId ? (
        <div className="chat-header">
          {tag?.properties.as
            ? `${tag.properties.as}  (${characters.getName(characterId)})`
            : characters.getName(characterId)}
        </div>
      ) : null}
      <div
        className={clsx(
          "chat-bubble",
          characterId === PLAYER_ID ? "chat-bubble-primary" : ""
        )}
      >
        {content}
      </div>
    </li>
  );
}
