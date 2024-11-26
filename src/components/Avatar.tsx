import { useCharacters } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";

interface AvatarProps {
  characterId: string;
}

export function Avatar({
  characterId,
  ...props
}: AvatarProps & ComponentProps<"div">) {
  const characters = useCharacters();
  const [avatar, setAvatar] = useState<
    Awaited<ReturnType<CharactersRegistry["getAvatar"]>> | undefined
  >();

  useEffect(() => {
    characters.getAvatar(characterId).then((avatar) => setAvatar(avatar));

    return () => characters.abort(characterId, "avatar");
  }, [characters, characterId]);

  return avatar ? (
    <div className={clsx("size-12 rounded-full", props.className)}>
      <img src={avatar.toDataUri()} />
    </div>
  ) : (
    <div className="skeleton h-12 w-12 rounded-full" />
  );
}
