import { getAvatar } from "@/queries/getAvatar";

interface AvatarProps {
  characterId: string;
}

export function Avatar({ characterId }: AvatarProps) {
  const avatar = characterId && getAvatar(characterId);

  return (
    <>
      {avatar ? (
        <div className="chat-image avatar">
          <div className="w-12 rounded-full">
            <img src={avatar.toDataUri()} />
          </div>
        </div>
      ) : null}
    </>
  );
}
