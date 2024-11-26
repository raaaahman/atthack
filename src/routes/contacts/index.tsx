import { createFileRoute } from "@tanstack/react-router";
import { SCREEN_PREFIX } from "./-constants";
import { CommandResult, OptionsResult, TextResult } from "yarn-bound";

type Contact = {
  id: string;
  name: string;
  role: string;
};

export const Route = createFileRoute("/contacts/")({
  loader: ({ context }) =>
    new Promise<Contact[]>((resolve, reject) => {
      if (!context.dialogue)
        return reject("The dialogue has not been correctly initialized.");

      const contacts =
        context.dialogue?.history
          .concat(context.dialogue.currentResult || [])
          .reduce(
            (results, result) =>
              {
              const screen = result.metadata.screen;
                return typeof screen === 'string' && screen.startsWith(SCREEN_PREFIX) &&
                  !results.find(
                    (current) => current.metadata.screen === result.metadata.screen
                  )
                  ? results.concat(result)
                  : results;
              },
            [] as (TextResult | CommandResult | OptionsResult)[]
          )
          .map((result) => {
            const id = result.metadata.screen.slice(SCREEN_PREFIX.length) as string;
            return {
              id,
              name: context.characters.getName(id),
              role: context.characters.getRole(id),
            };
          }) || [];

      return resolve(contacts);
    }),
});

