import { createMemoryHistory, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import { CharactersRegistry } from "./service/CharactersRegistry";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const variables = new Map();
const characters = new CharactersRegistry(variables);

export const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/"] }),
  context: {
    variables: variables,
    dialogue: null,
    characters,
  },
});
