import { RouterProvider } from "@tanstack/react-router";
import { use, useEffect, useRef, useState } from "react";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";

import { router } from "@/router";
import { loadProject } from "@/queries/loadProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { DialogueContext } from "@/contexts/DialogueContext";
import { CharactersContext } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { LocalStorageManager } from "@/service/LocalStorageManager";
import { isVariables, MemoryVariables } from "@/service/MemoryVariables";
import { DialogueRunner, isDialogueRunner } from "@/service/DialogueRunner";

const storage = new LocalStorageManager({});

const fetchProject = loadProject();

const variableStorage = storage.getItem("variables", (data) =>
  isVariables(data) ? new MemoryVariables(data) : new MemoryVariables()
);

const dialogueOptions = {
  startAt: "Mission_Start",
  variableStorage: variableStorage,
  combineTextAndOptionsResults: false,
};

const local = storage.getItem("dialogue", (data) =>
  isDialogueRunner(data) ? DialogueRunner.fromJSON(data, dialogueOptions) : null
);

const initDialogue = local
  ? Promise.resolve(local as DialogueRunner)
  : fetchProject
      .then((project) => fetch(project.sourceScripts[0]))
      .then((response) => response.text())
      .then((data) => {
        const dialogue = new DialogueRunner({
          ...dialogueOptions,
          dialogue: data,
        });

        storage.setItem("dialogue", dialogue);

        return dialogue;
      });

export function App() {
  const project = use(fetchProject);
  const variables = useRef(variableStorage);
  const dialogue = useRef(proxy(use(initDialogue))).current;
  const characters = useRef(new CharactersRegistry(variables.current));

  const [currentScript, setCurrentScript] = useState<string | undefined>(
    "scripts/" +
      dialogue.currentResult?.metadata.filetags.find((tag?: string) =>
        tag?.endsWith("yarn")
      )
  );

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

      if (!currentScript) return;

      if (dialogue.currentResult?.isDialogueEnd)
        setCurrentScript((currentScript) => {
          const currentIndex = project.sourceScripts.findIndex(
            (path) => path === currentScript
          );

          return currentIndex < project.sourceScripts.length - 1
            ? project.sourceScripts[currentIndex + 1]
            : currentScript;
        });
    });

    if (
      dialogue.currentResult &&
      "command" in dialogue.currentResult &&
      dialogue.currentResult.command.startsWith("wait")
    )
      dialogue.advance();
    return unsubscribe;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dialogue.runner = new dialogue.bondage.Runner();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dialogue.runner.noEscape = true;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dialogue.runner.setVariableStorage(variables.current);

    if (currentScript) {
      if (process.env.NODE_ENV === "development") console.log(dialogue);
      const controller = new AbortController();

      fetch(currentScript, { signal: controller.signal })
        .then((response) => response.text())
        .then((script) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dialogue.runner.load(script);
          dialogue.jump(dialogueOptions.startAt);
        });

      return () => controller.abort();
    }
  }, [currentScript]);

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


