import { ReactNode } from "react";
import clsx from "clsx";
import { OptionsResult, TextResult } from "yarn-bound";

import { PLAYER_ID } from "@/constants";
import { useCharacters } from "@/contexts/CharactersContext";
import { Avatar } from "../Avatar";
import MARKUP from "../markup";
import { Immutable } from "@/types/Immutable";

interface ChatMessageProps {
  result: Immutable<TextResult | OptionsResult>;
}

export function ChatMessage({ result }: ChatMessageProps) {
  const characterId = result.markup
    ?.find((tag) => tag.name === "character")
    ?.properties.name.toLowerCase();

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

      if (currentLength > tag.position + tag.length) {
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
          before,
          Component({ ...tag.properties, children: inner }),
          after
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
      {characterId ? <Avatar characterId={characterId} /> : null}
      {characterId ? (
        <div className="chat-header">{characters.getName(characterId)}</div>
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