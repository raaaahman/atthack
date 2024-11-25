// @vitest-environment jsdom

import { describe, it, expect, afterEach } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Link } from "./Link";

describe("The Link component (markup)", () => {
  afterEach(cleanup);

  it("should return the text value", async () => {
    render(<Link href="www.example.com">Example</Link>);

    await screen.findByText("Example");

    expect(screen.getByText("Example")).toBeInTheDocument();
  });

  // jsdom does not implement the HTMLDialogElement
  it.skip("open a modal when link is clicked, and closed when its button is clicked", async () => {
    render(<Link href="www.example.com">Example</Link>);

    await screen.findByText("Security Alert!");

    expect(screen.getByText("Security Alert!")).not.toBeVisible();

    fireEvent(
      screen.getByText("Example"),
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Security Alert!")).toBeVisible();
    });

    fireEvent(
      screen.getByRole("button", { name: "Back to safety" }),
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );

    await waitFor(() => {
      expect(screen.getByText("Security Alert!")).not.toBeVisible();
    });
  });
});
