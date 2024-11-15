import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { router } from "@/router";
import { loadProject } from "@/queries/loadProject";
import { ProjectContext } from "@/contexts/ProjectContext";
import { IProject } from "@/types/IProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";
import { MemoryVariables } from "@/service/MemoryVariables";
import { LocalStorageManager as LocalStorageManager } from "@/service/LocalStorageManager";
import { YarnVariableType } from "yarn-bound";

const storage = new LocalStorageManager({ autoSave: 5000 });

export function App() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const [project, setProject] = useState<IProject>();
  const variables = useRef<MemoryVariables>(
    storage.getItem<MemoryVariables>("variables", (variables) => {
      return new MemoryVariables(variables as [string, YarnVariableType][]);
    })
  );

  useEffect(() => {
    const controller = new AbortController();

    loadProject(controller.signal)
      .then((data) => {
        setStatus("success");
        setProject(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const context = {
    project,
    variables: variables.current,
    storage: storage,
  };

  return (
    <>
      {status === "pending" ? (
        <div className="h-dvh flex flex-col justify-center items-center">
          <span className="loading-spinner"></span>
        </div>
      ) : null}
      {status === "success" && project ? (
        <ProjectContext.Provider value={project}>
          <VariableStorageContext.Provider value={variables.current}>
            <RouterProvider router={router} context={context} />
          </VariableStorageContext.Provider>
        </ProjectContext.Provider>
      ) : null}
      {status === "error" ? (
        <p>Oops. Something went wrong. Try refreshing the page.</p>
      ) : null}
    </>
  );
}
