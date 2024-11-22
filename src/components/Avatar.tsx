import { useCharacters } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { useEffect, useState } from "react";

interface AvatarProps {
  characterId: string;
}

export function Avatar({ characterId }: AvatarProps) {
  const characters = useCharacters();
  const [avatar, setAvatar] = useState<
    Awaited<ReturnType<CharactersRegistry["getAvatar"]>> | undefined
  >();

  useEffect(() => {
    characters.getAvatar(characterId).then((avatar) => setAvatar(avatar));

    return () => characters.abort(characterId, "avatar");
  }, [characters, characterId]);

  return (
    <div className="chat-image avatar">
      {avatar ? (
        <div className="w-12 rounded-full">
          <img src={avatar.toDataUri()} />
        </div>
      ) : (
        <div className="skeleton h-12 w-12 rounded-full" />
      )}
    </div>
  );
}
