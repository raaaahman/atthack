import { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

import { RouteComponent as ContactFeed } from "@/routes/contacts/$contactId";
import { Component as RootLayout } from "@/routes/__root";

const meta = {
  title: "Screen/ContactFeed",
  component: ContactFeed,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ContactFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

const history = createMemoryHistory({ initialEntries: ["/contacts/scout"] });

const root = createRootRoute({
  component: RootLayout,
});
const route = createRoute({
  getParentRoute: () => root,
  path: "/contacts/$contactId",
});
root.addChildren([route]);

const variables = new Map([
  ["scout_name", "Scout"],
  ["scout_avatar", "Scout.png"],
]);

const dialogue = `title: Start
screen: conversation_scout
---
Scout: Yo man! How it's been?
  -> I'm doing great!
  -> So so...
===
`;

export const Scout: Story = {
  parameters: {
    variables,
    dialogue,
    history,
    routes: root,
  },
};
