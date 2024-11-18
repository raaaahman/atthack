import YarnBound, { YarnBoundOptions } from "yarn-bound";

export async function loadDialogue(
  path: string,
  options: Omit<YarnBoundOptions, "dialogue">,
  signal?: AbortSignal
) {
  const script = await fetch(path, { signal }).then((response) =>
    response.text()
  );

  const dialogue = new YarnBound({
    ...options,
    dialogue: script,
  });

  if (!dialogue.currentResult)
    throw new Error("The dialogue has not correctly been loaded.");

  return dialogue;
}
