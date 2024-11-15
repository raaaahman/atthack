import { DialogueRunner } from "@/service/DialogueRunner";
import { LocalStorageManager } from "@/service/LocalStorageManager";
import { IProject } from "@/types/IProject";

export async function loadDialogue(
  context: {
    storage: LocalStorageManager;
    project: IProject | null;
    variables: import("yarn-bound").IVariablesStorage;
  },
  pathname: string
) {
  const serialized = context.storage.getItem(pathname);

  let runner: DialogueRunner | null = null;
  if (serialized) {
    runner = DialogueRunner.fromJSON(serialized, {
      variableStorage: context.variables,
    });
  } else {
    const script = await fetch(pathname).then((response) => response.text());

    runner = new DialogueRunner({
      variableStorage: context.variables,
      dialogue: script,
      autoRun: 400,
    });

    if (!runner.currentResult)
      throw new Error("The dialogue has not correctly been loaded.");

    context.storage.setItem(pathname, runner);
  }

  return runner;
}
