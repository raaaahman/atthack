export interface IProject {
  sourceScripts: string[];
  baseLanguage?: string;
}

export function isProject(obj: object): obj is IProject {
  return "sourceScripts" in obj && obj.sourceScripts instanceof Array;
}
