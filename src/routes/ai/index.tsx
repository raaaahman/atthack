import { createFileRoute } from "@tanstack/react-router";
import { SCREEN_PREFIX } from "./-constants";

export const Route = createFileRoute("/ai/")({
  loader: ({ context }) =>
    context.dialogue?.history.reduce(
      (models, result) =>
        result.metadata.screen?.startsWith(SCREEN_PREFIX) &&
        !models.find((model) => result.metadata.screen.match(model))
          ? models.concat(result.metadata.screen.slice(SCREEN_PREFIX.length))
          : models,
      ["flemmy"]
    ) || [],
});
