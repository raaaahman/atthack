import { derive } from "derive-valtio";
import { createContext, useContext } from "react";
import YarnBound from "yarn-bound";

export const DialogueContext = createContext<YarnBound | null>(null);

export function useDialogue({ screen }: { screen?: string }) {
  const dialogue = useContext(DialogueContext);

  if (!dialogue)
    throw new Error("useDialogue should be used inside a DialogueContext.");

  if (dialogue.history.length > 199) {
    dialogue.history.splice(0, 100);
  }

  const derived = screen
    ? derive({
        history: (get) => {
          const history = get(dialogue.history);
          return history.filter((result) => result.metadata.screen === screen);
        },
        currentResult: (get) => {
          const currentResult = get(dialogue).currentResult;
          return currentResult?.metadata.screen === screen
            ? currentResult
            : null;
        },
      })
    : dialogue;

  const advance = (optionIndex?: number) => {
    if (dialogue.currentResult?.metadata.screen === screen)
      dialogue.advance(optionIndex);
  };

  return {
    state: derived,
    advance,
  };
}
