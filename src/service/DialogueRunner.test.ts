import { describe, it, expect } from "vitest";

import { DialogueRunner } from "@/service/DialogueRunner";

const script = `#index.yarn
#v0.0.0
title: Start
---
Hello World!
How do you do?
<<jump Node_2>>
===
title: Node_2
---
This node contains multiple lines of dialogue.
Like this one.
And this one.
End.
===
`;

describe("The DialogueRunner service", () => {
  describe("the toJSON() method", () => {
    it.each([
      ["at the very start of the dialogue", 0, "Start", "Hello World!"],
      ["after advancing one time", 1, "Start", "Hello World!"],
      [
        "after jumping to the next node",
        4,
        "Node_2",
        "This node contains multiple lines of dialogue.",
      ],
    ])(
      "should set the currentResult to the last reached node %s",
      (_, times, expectedTitle, expectedText) => {
        const dialogue = new DialogueRunner({
          dialogue: script,
        });

        for (let i = 0; i < times; i++) {
          dialogue.advance();
        }

        const serialized = dialogue.toJSON();

        expect(serialized).toHaveProperty("currentResult");
        expect(serialized.currentResult).toHaveProperty(
          "hashtags",
          expect.arrayContaining([])
        );
        expect(serialized.currentResult).toHaveProperty("text", expectedText);
        expect(serialized.currentResult).toHaveProperty(
          "metadata",
          expect.objectContaining({
            title: expectedTitle,
            filetags: ["index.yarn", "v0.0.0"],
          })
        );
      }
    );

    it.each([
      ["at the very start of the dialogue", [], ["Hello World!"]],
      ["after advancing one time", [], ["Hello World!", "How do you do?"]],
      [
        "after jumping to the next node",
        ["Hello World!", "How do you do?"],
        [
          "This node contains multiple lines of dialogue.",
          "Like this one.",
          "And this one.",
        ],
      ],
    ])(
      "should filter history to include all results up to the first result of the current node %s",
      (_, expected, notExpected) => {
        const dialogue = new DialogueRunner({ dialogue: script });

        for (let i = 0; i < expected.length + notExpected.length - 1; i++) {
          dialogue.advance();
        }
        const serialized = dialogue.toJSON();

        for (let i = 0; i < expected.length; i++) {
          expect(serialized.history).toContainEqual(
            expect.objectContaining({
              text: expected[i],
            })
          );
        }

        for (let i = 0; i < notExpected.length; i++) {
          expect(serialized.history).not.toContainEqual(
            expect.objectContaining({
              text: notExpected[i],
            })
          );
        }
      }
    );
  });
});
