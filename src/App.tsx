import { RouterProvider } from "@tanstack/react-router";
import { use, useEffect, useRef } from "react";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";
import GUI from "lil-gui";

import { router } from "@/router";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { DialogueContext } from "@/contexts/DialogueContext";
import { CharactersContext } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { LocalStorageManager } from "@/service/LocalStorageManager";
import { isVariables, MemoryVariables } from "@/service/MemoryVariables";
import { DialogueRunner, isDialogueRunner } from "@/service/DialogueRunner";
import { ParserNode } from "../dev/src/convert-yarn-to-js";
import { isProject } from "./types/IProject";

const storage = new LocalStorageManager({});

const variableStorage = storage.getItem("variables", (data) =>
  isVariables(data) ? new MemoryVariables(data) : new MemoryVariables()
) as MemoryVariables;

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      local.runner = new local.bondage.Runner();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      local.runner.setVariableStorage(variableStorage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      local.runner.load(data);
      return local as DialogueRunner;
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

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const controller = new AbortController();

    let gui: GUI | undefined;

    fetch("project.json", { signal: controller.signal })
      .then((response) => response.json())
      .then((project) => {
        if (!isProject(project)) throw new Error("Invalid project format.");

        const dialogueData = {
          script: dialogue.currentResult?.metadata.filetags?.find((tag) =>
            tag.endsWith(".yarn")
          ),
          node: dialogue.currentResult?.metadata.title || "Start",
        };

        gui = new GUI({ title: "Debug" });

        const dialogueFolder = gui.addFolder("Dialogue");
        dialogueFolder
          .add(dialogueData, "script", project.sourceScripts)
          .onChange((value: string) => {
            const filteredNodes = filterNodes(value);
            dialogueFolder.controllers
              .find((controller) => controller._name === "node")
              ?.options(filteredNodes)
              .setValue(filteredNodes[0]);
          });
        dialogueFolder
          .add(
            dialogueData,
            "node",
            dialogueData.script ? filterNodes(dialogueData.script) : []
          )
          .onChange((value: string) => dialogue.jump(value));

        const variablesData: {
          name: string;
          value: ReturnType<MemoryVariables["get"]> | undefined;
        } = {
          name: "",
          value: "",
        };
        const variablesFolder = gui.addFolder("Variables");
        variablesFolder
          .add(
            variablesData,
            "name",
            Array.from(variableStorage._variables.keys())
          )
          .onChange((value: string) => {
            variablesData.value = variableStorage.get(value);
            variablesFolder.controllers
              .find((controller) => controller._name === "value")
              ?.updateDisplay();
          });
        variablesFolder
          .add(variablesData, "value", undefined)
          .onChange((value: ReturnType<MemoryVariables["get"]>) => {
            if (variablesData.name && value)
              variableStorage.set(variablesData.name, value);
          });

        gui.close();

        function filterNodes(script: string) {
          return Object.values<ParserNode>(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dialogue.runner.yarnNodes
          )
            .filter((node) => node.filetags.find((tag) => script.endsWith(tag)))
            .map((node) => node.title);
        }
      });

    return () => {
      if (gui) gui.destroy();
      controller.abort();
    };
  }, [dialogue]);

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


