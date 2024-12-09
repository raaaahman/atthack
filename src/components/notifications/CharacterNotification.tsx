import clsx from "clsx";
import { ComponentProps } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { useCharacters } from "@/contexts/CharactersContext";
import { Avatar } from "@/components/Avatar";

type CharacterNotificationProps = {
  characterId: string | undefined;
};

export function CharacterNotification({
  className,
  onClick,
  characterId,
  ...props
}: ComponentProps<"div"> & CharacterNotificationProps) {
  const characters = useCharacters();

  return (
    <div
      role="status"
      className={clsx(
        className,
        "alert bg-secondary text-secondary-content flex justify-around"
      )}
      onClick={onClick}
      {...props}
    >
      {characterId ? <Avatar characterId={characterId} /> : null}
      <div>
        {characterId
          ? characters.getName(characterId) + " sent you a message."
          : "You received a new message."}
      </div>
      <span className="sr-only">Read</span>
      <ArrowUpRightIcon title="Read" role="presentation" className="size-10" />
    </div>
  );
}
