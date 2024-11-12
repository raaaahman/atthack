import { isProject } from "../types/IProject";

export async function loadProject(signal?: AbortSignal) {
  const response = await fetch("project.json", { signal });
  const project = await response.json();

  if (!project)
    return Promise.reject("The project has not been correctly loaded.");

  if (!isProject(project))
    return Promise.reject("The project is not correctly formatted.");

  if (!(project.sourceScripts?.length > 0))
    return Promise.reject("There's no scripts in the project");

  return project;
}
