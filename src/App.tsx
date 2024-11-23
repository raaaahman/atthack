import { RouterProvider } from "@tanstack/react-router";
import YarnBound from "yarn-bound";
import { useEffect, useRef, useState } from "react";
import { proxy, subscribe } from "valtio";

import { router } from "@/router";
import { loadProject } from "@/queries/loadProject";
import { ProjectContext } from "@/contexts/ProjectContext";
import { IProject } from "@/types/IProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { DialogueContext } from "@/contexts/DialogueContext";
import { CharactersContext } from "./contexts/CharactersContext";
import { CharactersRegistry } from "./service/CharactersRegistry";

export function App() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const [project, setProject] = useState<IProject | null>(null);
  const variables = useRef(new Map());
  const [currentScript, setCurrentScript] = useState<string | undefined>();
  const [dialogue, setDialogue] = useState<YarnBound | null>(null);
  const characters = useRef(new CharactersRegistry(variables.current));

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal)
      .then((data) => {
        setProject(data);
        setCurrentScript(data.sourceScripts[0]);
        setStatus("success");

        return data;
      })
      .catch((error) => {
        console.log(error);
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (project && dialogue)
      return subscribe(dialogue, () => {
        if (!currentScript) return;

        const currentIndex = project.sourceScripts.findIndex(
          (path) => path === currentScript
        );

        if (
          currentIndex < project.sourceScripts.length &&
          dialogue.currentResult?.isDialogueEnd
        )
          setCurrentScript(project.sourceScripts[currentIndex + 1]);
      });
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

    if (currentScript) {
      console.log(dialogue);
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
            setDialogue(
              proxy(
                new YarnBound({
                  dialogue: script,
                  variableStorage: variables.current,
                  combineTextAndOptionsResults: true,
                })
              )
            );
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

