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
    it("should set the currentResult tot the last reached node", () => {
      const dialogue = new DialogueRunner({
        dialogue: script,
      });

      dialogue.advance();
      dialogue.advance();
      dialogue.advance();
      dialogue.advance();
      const serialized = dialogue.toJSON();

      expect(serialized).toHaveProperty("currentResult");
      expect(serialized.currentResult).toHaveProperty(
        "hashtags",
        expect.arrayContaining([])
      );
      expect(serialized.currentResult).toHaveProperty(
        "text",
        "This node contains multiple lines of dialogue."
      );
      expect(serialized.currentResult).toHaveProperty(
        "metadata",
        expect.objectContaining({
          title: "Node_2",
          filetags: ["index.yarn", "v0.0.0"],
        })
      );
    });

    it("should filter history to include all results up to the first result of the current node", () => {
      const dialogue = new DialogueRunner({ dialogue: script });

      dialogue.advance();
      dialogue.advance();
      dialogue.advance();
      dialogue.advance();
      dialogue.advance();
      const serialized = dialogue.toJSON();

      expect(serialized.history).toContainEqual(
        expect.objectContaining({
          text: "Hello World!",
        })
      );
      expect(serialized.history).toContainEqual(
        expect.objectContaining({
          text: "How do you do?",
        })
      );
      expect(serialized.history).not.toContainEqual(
        expect.objectContaining({
          text: "This node contains multiple lines of dialogue.",
        })
      );
      expect(serialized.history).not.toContainEqual(
        expect.objectContaining({ text: "Like this one." })
      );
      expect(serialized.history).not.toContainEqual(
        expect.objectContaining({ text: "And this one." })
      );
    });
  });
});
