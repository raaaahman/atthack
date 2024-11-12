import { createContext, useContext } from "react";
import YarnBound from "yarn-bound";

export const DialogueContext = createContext<YarnBound | null>(null);

export function useDialogue() {
  const dialogue = useContext(DialogueContext);

  if (!dialogue) {
    throw new Error(
      "useDialogue hook should be used within a <DialogueContext.Provider>."
    );
  }

  return dialogue;
}
