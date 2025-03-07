import { test, expect } from "@playwright/test";
import convertYarnToJS from "../dev/src/convert-yarn-to-js";

const FIRST_SCRIPT = `#first.yarn
#v0.0.0
title: Start
screen: conversation_scout
---
<<set $pulse_name = "Pulse">>
<<set $pulse_avatar = "Pulse.png">>
<<set $pulse_role = 3>>

<<set $scout_name = "Scout">>
<<set $scout_avatar = "Scout.png">>
<<set $scout_role = 3>>

Scout: Hello pal!
Scout: How do you do?

-> Say Hello
  Pulse: Hello mate!
-> Say Nothing
  Pulse: ...
<<jump Another_Node>>
===
title: Another_Node
screen: conversation_scout
---
Scout: Let's get the party started!
<<jump Mission_Start>>
===`;

const SECOND_SCRIPT = `#second.yarn
#v0.0.0
title: Mission_Start
screen: conversation_whisper
---
<<set $whisper_name = "Whisper">>
<<set $whisper_avatar = "Whisper.png">>
<<set $whisper_role = 3>>

Pulse: You won't believe what I found.
Whisper: Let's hack back!
<<pause>>
===
`;

const program = convertYarnToJS(FIRST_SCRIPT).concat(
  convertYarnToJS(SECOND_SCRIPT)
);

test("Dialogue feature", async ({ context, browser }) => {
  await context.close();

  // We have to bypass the service worker set by our Vite Yarn Plugin
  context = await browser.newContext({
    serviceWorkers: "block",
  });

  context.route("**/YarnNodes.json", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(program),
      headers: {
        "content-type": "application/json",
      },
    });
  });

  const page = await context.newPage();

  await page.goto("/");

  // Notification
  await expect(page.getByRole("status")).toBeVisible();

  await expect(page.getByRole("status")).not.toBeVisible();

  // Contacts page
  await page.getByRole("link", { name: /messages/i }).click();

  // Dialogue with contact
  await page.getByRole("link", { name: /scout/i }).click();

  await expect(page.getByText("Hello pal!")).toBeInViewport();

  await page.getByRole("list").click();

  await expect(page.getByText("How do you do?")).toBeInViewport();

  await page.getByRole("list").click();

  await page.getByText("Say Hello").click();

  await expect(page.getByText("Hello mate!")).toBeInViewport();

  // Next node
  await page.getByRole("list").click();

  await expect(page.getByText("Let's get the party started!")).toBeInViewport();

  // Save and load
  await page.reload();

  await page.getByRole("link", { name: /messages/i }).click();

  await page.getByRole("link", { name: /scout/i }).click();

  await expect(page.getByText("Let's get the party started!")).toBeInViewport();

  // Next script
  await page.getByRole("list").click();

  await page.getByRole("link", { name: /messages/i }).click();

  await page.getByRole("link", { name: /whisper/i }).click();

  await expect(
    page.getByText("You won't believe what I found.")
  ).toBeInViewport();

  await page.getByRole("list").click();

  await expect(page.getByText("Let's hack back!")).toBeInViewport();

  await page.getByRole("list").click();

  // End modal
  await expect(page.getByRole("alertdialog")).toBeVisible();
});
