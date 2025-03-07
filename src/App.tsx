import { RouterProvider } from "@tanstack/react-router";
import { use, useEffect, useRef } from "react";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";

import { router } from "@/router";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { DialogueContext } from "@/contexts/DialogueContext";
import { CharactersContext } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { LocalStorageManager } from "@/service/LocalStorageManager";
import { isVariables, MemoryVariables } from "@/service/MemoryVariables";
import { DialogueRunner, isDialogueRunner } from "@/service/DialogueRunner";

const storage = new LocalStorageManager({});

const variableStorage = storage.getItem("variables", (data) =>
  isVariables(data) ? new MemoryVariables(data) : new MemoryVariables()
);

const dialogueOptions = {
  variableStorage: variableStorage,
  combineTextAndOptionsResults: false,
};

const local = storage.getItem("dialogue", (data) =>
  isDialogueRunner(data) ? DialogueRunner.fromJSON(data, dialogueOptions) : null
);

const initDialogue = fetch("YarnNodes.json")
  .then((response) => response.json())
  .then((data) => {
    if (local) {
      local.runner = new local.bondage.Runner();
      local.runner.setVariableStorage(variableStorage);
      local.runner.load(data);
      return local;
    } else {
      const dialogue = new DialogueRunner({
        ...dialogueOptions,
        dialogue: data,
      });

      storage.setItem("dialogue", dialogue);
      return dialogue;
    }
  });

export function App() {
  const variables = useRef(variableStorage);
  const dialogue = useRef(proxy(use(initDialogue))).current;
  const characters = useRef(new CharactersRegistry(variables.current));

  const endModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let lastTitle = dialogue?.currentResult?.metadata.title;

    const unsubscribe = subscribeKey(dialogue, "currentResult", () => {
      if (
        dialogue.currentResult &&
        "command" in dialogue.currentResult &&
        dialogue.currentResult.command === "pause"
      )
        endModalRef.current?.showModal();

      if (dialogue.currentResult?.metadata.title !== lastTitle) {
        storage.saveItems();
        lastTitle = dialogue.currentResult?.metadata.title;
      }

      if (
        dialogue.currentResult &&
        "command" in dialogue.currentResult &&
        dialogue.currentResult.command.startsWith("wait")
      ) {
        setTimeout(
          () => {
            dialogue.advance();
          },
          parseInt(
            dialogue.currentResult.command.match(/wait\s(\d+)/)?.at(1) || "1"
          ) * 1000
        );
      }
    });

    if (
      dialogue.currentResult &&
      "command" in dialogue.currentResult &&
      dialogue.currentResult.command.startsWith("wait")
    )
      dialogue.advance();
    return unsubscribe;
  }, []);

  const context = {
    variables: variables.current,
    dialogue,
    characters: characters.current,
  };

  return (
    <>
      <VariableStorageContext.Provider value={variables.current}>
        <CharactersContext.Provider value={characters.current}>
          <DialogueContext.Provider value={dialogue}>
            <RouterProvider router={router} context={context} />
          </DialogueContext.Provider>
        </CharactersContext.Provider>
      </VariableStorageContext.Provider>
      <dialog ref={endModalRef} className="modal" role="alertdialog">
        <div className="modal-box">
          <strong className="block text-lg font-semibold">
            Thank you for playing!
          </strong>
          <p>
            That game was made in a month for the{" "}
            <a href="https://itch.io/jam/game-off-2024">
              GithHub Game Off 2024
            </a>{" "}
            game jam. We had to cut some corners to make it fit the schedule.
          </p>
          <p>
            The story does not reach the end we envisionned! If you want to know
            how everything ends, stay tuned for future updates.
          </p>
          <p>Cheers.</p>
          <form method="dialog" className="modal-action">
            <button className="btn btn-success">Okay</button>
          </form>
        </div>
      </dialog>
    </>
  );
}


