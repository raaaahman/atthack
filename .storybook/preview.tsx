import React from "react";

import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { proxy } from "valtio";
import { YarnVariableType } from "yarn-bound";

import { CharactersRegistry } from "../src/service/CharactersRegistry";
import { DialogueRunner } from "../src/service/DialogueRunner";
import { VariableStorageContext } from "../src/contexts/VariableStorageContext";
import { CharactersContext } from "../src/contexts/CharactersContext";
import { DialogueContext } from "../src/contexts/DialogueContext";
import "../src/index.css";

const defaultDialogue = `title: Start
---
Yarn Spinner is a language for writing conversations in games!
You can use it to write branching dialogue, and use that in a game engine!

For example, here's a choice between some options!

-> Wow, some options!
    You got it, pal!
-> Can I put text inside options?
    You sure can!
    For example, here's some lines inside an option.
    You can even put options inside OTHER options!
    -> Like this!
        Wow!
    -> Or this!
        Incredible!

// Comments start with two slashes, and won't show up in your conversation.
// They're good for leaving notes!

You can also write 'commands', which represent things that happen in the game!

In this editor, they'll appear as text:

<<fade_up 1.0>>

-> Nice!
    Right??
-> But it didn't actually fade!
    That's because this page doesn't know about 'fading', or any other feature. 
    When you're testing your script on this page, we'll just show you your commands as text.
    In a real game, you can define custom commands that do useful work!

You can also use variables, which store information!

Let's set a variable called "$name".

<<set $name to "Yarn">>

Done! You can see it appear in the list of variables at the bottom of the screen.

We can use "$name" in lines: My name's {$name}!

-> What can I store in variables?
    You can store text, numbers, and true/false values!
-> Where do variables get stored?
    In this page, we store them in memory. When you use Yarn Spinner in a game engine, like Unity, you can store them in memory, or write custom code that stores them on disk alongside the rest of your saved game!

We can also use 'if' statements to change what happens!

Let's set a variable called '$gold' to 5.

<<set $gold to 5>>

Next, let's run different lines depending on what's stored inside '$gold':

<<if $gold > 5>>
    The '$gold' variable is bigger than 5!
<<else>>
    The '$gold' variable is 5 or less!
<<endif>>

Finally, we can use the "jump" command to go to a different node! Let's do that now!

<<jump OtherNode>>
===
title: OtherNode
---
Here we are in a different node! Nodes let you divide up your content into different blocks, which makes it easier to manage.

We're all done! Try changing the text in the editor to the left, and clicking Test again!
===`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, { parameters }) => {
      const variables = new Map<string, YarnVariableType>();
      const characters = new CharactersRegistry(
        parameters.variables ?? variables
      );
      const runner = new DialogueRunner({
        variableStorage: variables,
        combineTextAndOptions: false,
        dialogue: parameters.dialogue ?? defaultDialogue,
      });
      const history = createMemoryHistory({ initialEntries: ["/"] });
      const root = createRootRoute();
      const route = createRoute({
        path: "/",
        getParentRoute: () => root,
      });
      root.addChildren([parameters.route ?? route]);
      const router = createRouter({
        routeTree: parameters.routes ?? root,
        history: parameters.history ?? history,
      });

      return (
        <VariableStorageContext value={parameters.variables ?? variables}>
          <CharactersContext value={parameters.Characters ?? characters}>
            <DialogueContext value={proxy(parameters.runner ?? runner)}>
              <RouterProvider
                router={parameters.router ?? router}
                defaultComponent={() => <Story />}
              />
            </DialogueContext>
          </CharactersContext>
        </VariableStorageContext>
      );
    },
  ],
};

export default preview;

export const decorators = [
  withThemeByClassName({
    defaultTheme: "light",
    themes: {
      light: "light",
      dark: "dark",
    },
  }),
];
