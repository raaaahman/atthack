import { RouterProvider } from "@tanstack/react-router";
import YarnBound from "yarn-bound";
import { useEffect, useRef, useState } from "react";

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
  const [dialogue, setDialogue] = useState<YarnBound | null>(null);
  const characters = useRef(new CharactersRegistry(variables.current));

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal)
      .then((data) => {
        setProject(data);

        return data;
      })
      .then((project) =>
        Promise.all(
          project.sourceScripts.map((path) =>
            fetch(path, { signal: controller.signal }).then((response) =>
              response.text()
            )
          )
        )
      )
      .then((scripts) => {
        const dialogue = new YarnBound({
          dialogue: scripts[0],
          variableStorage: variables.current,
          combineTextAndOptionsResults: true,
        });
        for (let i = 1; i < scripts.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dialogue.runner.load(scripts[i]);
        }
        setDialogue(dialogue);
        setStatus("success");
      })
      .catch((error) => {
        console.log(error);
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const context = { project, variables: variables.current, dialogue };

  return (
    <>
      {status === "pending" ? (
        <div className="h-dvh flex flex-col justify-center items-center">
          <span className="loading-spinner"></span>
        </div>
      ) : null}
      {status === "success" ? (
        <ProjectContext.Provider value={project}>
          <VariableStorageContext.Provider value={variables.current}>
            <CharactersContext.Provider value={characters.current}>
              <DialogueContext.Provider value={dialogue}>
                <RouterProvider router={router} context={context} />
              </DialogueContext.Provider>
            </CharactersContext.Provider>
          </VariableStorageContext.Provider>
        </ProjectContext.Provider>
      ) : null}
      {status === "error" ? (
        <p>Oops. Something went wrong. Try refreshing the page.</p>
      ) : null}
    </>
  );
}
