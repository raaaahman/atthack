import { derive } from "derive-valtio";
import { createContext, useContext, useEffect, useState } from "react";
import { proxy } from "valtio";
import YarnBound from "yarn-bound";

export const DialogueContext = createContext<YarnBound | null>(null);

export function useDialogue({ screen }: { screen: string }) {
  const dialogue = useContext(DialogueContext);

  const [state, setState] = useState<YarnBound>();

  useEffect(() => {
    if (dialogue) setState(proxy(dialogue));
  }, [dialogue]);

  const [derived, setDerived] =
    useState<Pick<YarnBound, "history" | "currentResult">>();

  useEffect(() => {
    if (state)
      setDerived(
        derive({
          history: (get) =>
            get(state).history.filter(
              (result) => result.metadata.screen === screen
            ),
          currentResult: (get) => {
            const currentResult = get(state).currentResult;
            console.log(currentResult);
            return currentResult?.metadata.screen === screen
              ? currentResult
              : null;
          },
        })
      );
  }, [screen, state]);

  return {
    state: derived,
    advance: state?.advance.bind(state),
  };
}
