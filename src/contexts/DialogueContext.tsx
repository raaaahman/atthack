import { derive } from "derive-valtio";
import { createContext, useContext } from "react";
import { proxy } from "valtio";
import YarnBound from "yarn-bound";

export const DialogueContext = createContext<YarnBound | null>(null);

export function useDialogue({ screen }: { screen: string }) {
  const dialogue = useContext(DialogueContext);

  if (!dialogue)
    throw new Error("useDialogue should be used inside a DialogueContext.");

  const state = proxy(dialogue);

  const derived = derive({
    history: (get) =>
      get(state).history.filter((result) => result.metadata.screen === screen),
    currentResult: (get) => {
      const currentResult = get(state).currentResult;
      return currentResult?.metadata.screen === screen ? currentResult : null;
    },
  });

  return {
    state: derived,
    advance: state?.advance.bind(state),
  };
}
