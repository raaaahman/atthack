// @vitest-environment jsdom

import { PropsWithChildren } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("should return the text of a TextResult", async () => {
    render(
      <ChatMessage
        result={{
          text: "Hello World!",
          metadata: {
            title: "Hello_World",
            fileTags: [],
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
            fileTags: [],
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
            fileTags: [],
          },
          hashtags: [],
          markup: [{ name: "b", position: 5, length: 2, properties: {} }],
        }}
      />,
      { wrapper }
    );

    await screen.findByText("is");

    expect(screen.getByTestId("test-b"));
  });
});
