import { RouterProvider } from "@tanstack/react-router";
import YarnBound from "yarn-bound";
import { useEffect, useRef, useState } from "react";
import { proxy } from "valtio";
import { subscribeKey } from "valtio/utils";

import { router } from "@/router";
import { loadProject } from "@/queries/loadProject";
import { ProjectContext } from "@/contexts/ProjectContext";
import { IProject } from "@/types/IProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { DialogueContext } from "@/contexts/DialogueContext";
import { CharactersContext } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { LocalStorageManager } from "@/service/LocalStorageManager";
import { isVariables, MemoryVariables } from "@/service/MemoryVariables";
import { DialogueRunner, isDialogueRunner } from "@/service/DialogueRunner";

const storage = new LocalStorageManager({});

export function App() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const [project, setProject] = useState<IProject | null>(null);
  const variables = useRef(
    storage.getItem("variables", (data) =>
      isVariables(data) ? new MemoryVariables(data) : new MemoryVariables()
    )
  );
  const [dialogue, setDialogue] = useState<YarnBound | null>(null);
  const characters = useRef(new CharactersRegistry(variables.current));

  const dialogueOptions = {
    startAt: "Mission_Start",
    variableStorage: variables.current,
    combineTextAndOptionsResults: false,
  };

  const local = storage.getItem("dialogue", (data) =>
    isDialogueRunner(data)
      ? DialogueRunner.fromJSON(data, dialogueOptions)
      : null
  );

  const [currentScript, setCurrentScript] = useState<string | undefined>(
    local
      ? "scripts/" +
          local.currentResult?.metadata.filetags.find((tag?: string) =>
            tag?.endsWith("yarn")
          ) || "index.yarn"
      : undefined
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal)
      .then((data) => {
        setProject(data);
        setCurrentScript(
          (currentScript) => currentScript || data.sourceScripts[0]
        );
        setStatus("success");

        return data;
      })
      .catch((error) => {
        console.log(error);
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const endModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let lastTitle = dialogue?.currentResult?.metadata.title;

    if (project && dialogue) {
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
    }
  }, [project, dialogue]);

  useEffect(() => {
    if (dialogue) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dialogue.runner = new dialogue.bondage.Runner();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dialogue.runner.noEscape = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dialogue.runner.setVariableStorage(variables.current);
    }

    if (!dialogue && local) {
      setDialogue(proxy(local));
    } else if (currentScript) {
      if (process.env.NODE_ENV === "development") console.log(dialogue);
      const controller = new AbortController();

      fetch(currentScript, { signal: controller.signal })
        .then((response) => response.text())
        .then((script) => {
          if (dialogue) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dialogue.runner.load(script);
            dialogue.jump("Mission_Start");
          } else {
            const dialogue = new DialogueRunner({
              dialogue: script,
              ...dialogueOptions,
            });

            storage.setItem("dialogue", dialogue);

            setDialogue(proxy(dialogue));
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.name !== "AbortError") setStatus("error");
        });

      return () => controller.abort();
    }
  }, [currentScript]);

  const context = {
    project,
    variables: variables.current,
    dialogue,
    characters: characters.current,
  };

  return (
    <>
      {status === "pending" ? <LoadingSpinner /> : null}
      {status === "success" ? (
        <ProjectContext.Provider value={project}>
          <VariableStorageContext.Provider value={variables.current}>
            <CharactersContext.Provider value={characters.current}>
              {dialogue ? (
                <DialogueContext.Provider value={dialogue}>
                  <RouterProvider router={router} context={context} />
                </DialogueContext.Provider>
              ) : (
                <LoadingSpinner />
              )}
            </CharactersContext.Provider>
          </VariableStorageContext.Provider>
        </ProjectContext.Provider>
      ) : null}
      {status === "error" ? (
        <div className="h-dvh flex flex-col justify-center items-center">
          <p>Oops. Something went wrong. Try refreshing the page.</p>
        </div>
      ) : null}
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

function LoadingSpinner() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center">
      <span className="loading-spinner"></span>
    </div>
  );
}
