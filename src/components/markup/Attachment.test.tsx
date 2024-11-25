// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { fileServer } from "@/tests/fileServerMock";
import { Attachment } from "./Attachment";

fileServer.listen();

vi.stubGlobal(
  "URL",
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "fakeurl"),
    revokeObjectURL: vi.fn(),
  })
);

describe("The Attachment component", () => {
  afterEach(cleanup);

  it.each([["jpg"], ["png"], ["svg"], ["jpeg"], ["webp"]])(
    "should render an image if has a path properties with an image extension (%s)",
    async (ext) => {
      render(
        <Attachment path={"/images/example." + ext}>Example image.</Attachment>
      );

      await screen.findByAltText("Example image.");

      expect(screen.getAllByAltText("Example image.")).toBeDefined();
    }
  );
});
