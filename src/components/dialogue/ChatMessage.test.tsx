// @vitest-environment jsdom

import { PropsWithChildren } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { YarnVariableType } from "yarn-bound";

import { ChatMessage } from "./ChatMessage";
import { CharactersContext } from "@/contexts/CharactersContext";
import { CharactersRegistry } from "@/service/CharactersRegistry";

vi.mock("@/components/markup", () => ({
  default: {
    b: ({ children }: PropsWithChildren<object>) => (
      <strong data-testid="test-b">{children}</strong>
    ),
  },
}));

const wrapper = ({ children }: PropsWithChildren<object>) => {
  const variables = new Map<string, YarnVariableType>([
    ["pulse_name", "Orion Vale"],
  ]);
  const characters = new CharactersRegistry(variables);
  return (
    <CharactersContext.Provider value={characters}>
      {children}
    </CharactersContext.Provider>
  );
};

describe("The ChatMessage component", () => {
  afterEach(cleanup);

  it("should return the text of a TextResult", async () => {
    render(
      <ChatMessage
        result={{
          text: "Hello World!",
          metadata: {
            title: "Hello_World",
            filetags: [],
          },
          hashtags: [],
        }}
      />,
      { wrapper }
    );

    await screen.findByText("Hello World!");

    expect(screen.getByText("Hello World!")).toBeDefined();
  });

  it("should use the characters name from the CharactersRegistry", async () => {
    render(
      <ChatMessage
        result={{
          text: "'sup?",
          metadata: {
            title: "Hello_World",
            filetags: [],
          },
          hashtags: [],
          markup: [
            {
              name: "character",
              position: 0,
              length: "Pulse".length,
              properties: {
                name: "Pulse",
              },
            },
          ],
        }}
      />,
      { wrapper }
    );

    await screen.findByText("'sup?");

    expect(screen.getByText("Orion Vale")).toBeDefined();
  });

  it("should replace inline markup with associated component", async () => {
    render(
      <ChatMessage
        result={{
          text: "This is the real one!",
          metadata: {
            title: "Node",
            filetags: [],
          },
          hashtags: [],
          markup: [{ name: "b", position: 5, length: 2, properties: {} }],
        }}
      />,
      { wrapper }
    );

    await screen.findByText("is");

    expect(screen.getByTestId("test-b")).toHaveTextContent("is");
  });

  it("should replace markup when the tag span the whole line", async () => {
    render(
      <ChatMessage
        result={{
          text: "Don't talk to me like that!",
          metadata: {
            title: "Node",
            filetags: [],
          },
          hashtags: [],
          markup: [
            {
              name: "b",
              position: 0,
              length: "Don't talk to me like that!".length,
              properties: {},
            },
          ],
        }}
      />,
      { wrapper }
    );

    await screen.findByText("Don't talk to me like that!");

    expect(screen.getByTestId("test-b")).toHaveTextContent(
      "Don't talk to me like that!"
    );
  });
});
