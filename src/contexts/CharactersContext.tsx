import { CharactersRegistry } from "@/service/CharactersRegistry";
import { createContext, useContext } from "react";

export const CharactersContext = createContext<CharactersRegistry | null>(null);

export function useCharacters() {
  const characters = useContext(CharactersContext);

  if (!characters)
    throw new Error(
      "useCharacters hook must be used within a CharactersContext provider."
    );

  return characters;
}
