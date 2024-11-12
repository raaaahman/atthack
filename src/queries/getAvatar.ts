import { bigSmile, bottts } from "@dicebear/collection";
import { createAvatar, Result } from "@dicebear/core";

const charactersRegistry = new Map<string, Result>();

export function getAvatar(characterId: string) {
  if (charactersRegistry.has(characterId)) {
    return charactersRegistry.get(characterId);
  }

  const style = characterId.startsWith("ia") ? bottts : bigSmile;

  const avatar = createAvatar<typeof style>(style, {
    seed: characterId,
    flip: characterId === "character1",
  });

  charactersRegistry.set(characterId, avatar);

  return avatar;
}
