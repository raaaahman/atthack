import { RouterProvider } from "@tanstack/react-router";

import { router } from "@/router";
import { useEffect, useRef, useState } from "react";
import { loadProject } from "@/queries/loadProject";
import { ProjectContext } from "@/contexts/ProjectContext";
import { IProject } from "@/types/IProject";
import { VariableStorageContext } from "@/contexts/VariableStorageContext";

export function App() {
  const [status, setStatus] = useState<"pending" | "error" | "success">(
    "pending"
  );
  const [project, setProject] = useState<IProject>();
  const variables = useRef(new Map());

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

  const context = { project, variables: variables.current };

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
