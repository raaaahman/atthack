import { RouterProvider } from "@tanstack/react-router";
import YarnBound from "yarn-bound";

import { router } from "@/router";
import { useEffect, useRef, useState } from "react";
import { loadProject } from "@/queries/loadProject";
import { ProjectContext } from "@/contexts/ProjectContext";
import { IProject } from "@/types/IProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { loadDialogue } from "./queries/loadDialogue";
import { DialogueContext } from "./contexts/DialogueContext";

export function App() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const [project, setProject] = useState<IProject | null>(null);
  const variables = useRef(new Map());
  const [dialogue, setDialogue] = useState<YarnBound | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal)
      .then((data) => {
        setProject(data);

        return data;
      })
      .then((project) =>
        loadDialogue(
          project.sourceScripts[0],
          {
            variableStorage: variables.current,
            combineTextAndOptionsResults: true,
          },
          controller.signal
        )
      )
      .then((dialogue) => {
        setDialogue(dialogue);
        setStatus("success");
      })
      .catch((error) => {
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
            <DialogueContext.Provider value={dialogue}>
              <RouterProvider router={router} context={context} />
            </DialogueContext.Provider>
          </VariableStorageContext.Provider>
        </ProjectContext.Provider>
      ) : null}
      {status === "error" ? (
        <p>Oops. Something went wrong. Try refreshing the page.</p>
      ) : null}
    </>
  );
}
