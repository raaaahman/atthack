import { createContext, useContext } from "react";
import { IProject } from "@/types/IProject";

export const ProjectContext = createContext<IProject | null>(null);

export function useProject() {
  const project = useContext(ProjectContext);

  if (!project) {
    throw new Error(
      "useProject hook must be used within a ProjectContext.Provider."
    );
  }

  return project;
}
