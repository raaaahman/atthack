// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { Attachment } from "./Attachment";

vi.stubGlobal(
  "URL",
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "fakeurl"),
    revokeObjectURL: vi.fn(),
  })
);

describe("The Attachment component", () => {
  afterEach(cleanup);

  it.each([["jpg"], ["png"], ["svg"], ["jpeg"], ["webp"], ["gif"]])(
    "should render an image if has a path properties with an image extension (%s)",
    async (ext) => {
      render(
        <Attachment src={"/images/example." + ext}>Example image.</Attachment>
      );

      await screen.findByAltText("Example image.");

      expect(screen.getAllByAltText("Example image.")).toBeDefined();
    }
  );
});
