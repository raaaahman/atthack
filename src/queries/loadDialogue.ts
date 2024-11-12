import YarnBound, { YarnBoundOptions } from "yarn-bound";

export async function loadDialogue(
  path: string,
  options: Omit<YarnBoundOptions, "dialogue">
) {
  const script = await fetch(path).then((response) => response.text());

  const dialogue = new YarnBound({
    ...options,
    dialogue: script,
  });

  if (!dialogue.currentResult)
    throw new Error("The dialogue has not correctly been loaded.");

  // set all the needed variables
  if ("command" in dialogue.currentResult) {
    dialogue.advance();
  }

  return dialogue;
}
