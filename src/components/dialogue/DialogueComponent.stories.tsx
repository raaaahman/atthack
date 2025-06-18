import { Meta } from "@storybook/react-vite";

import { DialogueComponent } from "./DialogueComponent";
import { DialogueRunner } from "@/service/DialogueRunner";
import { YarnVariableType } from "yarn-bound";
import { proxy } from "valtio";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { CharactersContext } from "@/contexts/CharactersContext";

const meta = {
  title: "Component/Dialogue",
  component: DialogueComponent,
} satisfies Meta<typeof DialogueComponent>;

export default meta;

const variables = new Map<string, YarnVariableType>([
  ["scout_name", "Scout"],
  ["scout_avatar", "Scout.png"],
  ["pulse_name", "Pulse"],
  ["pulse_avatar", "Pulse.png"],
]);

const characters = new CharactersRegistry(variables);

const dialogue = `title: Start
screen: conversation_scout
---
Scout: Yo man! How it's been?
  -> Pulse: I'm doing great!
  -> Pulse: So so...
===
`;

const runner = new DialogueRunner({
  variableStorage: variables,
  combineTextAndOptionsResults: false,
  dialogue,
});

export const Scout = {
  render: () => (
    <CharactersContext value={characters}>
      <DialogueComponent
        state={proxy(runner)}
        advance={runner.advance.bind(runner)}
      />
    </CharactersContext>
  ),
};
