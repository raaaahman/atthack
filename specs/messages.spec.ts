import { test, expect } from "@playwright/test";

const PROJECT = {
  projectFileVersion: "2.0",
  sourceScripts: ["first.yarn", "second.yarn"],
  baseLanguage: "en",
  localisation: {},
};

const FIRST_SCRIPT = `#first.yarn
#v0.0.0
title: Mission_Start
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

test("Can navigate to specific contact", async ({ page }) => {
  await page.route("*/**/project.json", async (route) => {
    const response = await route.fetch();

    await route.fulfill({
      response,
      json: PROJECT,
    });
  });

  await page.route("**/*.yarn", async (route, request) => {
    let body: string = "";
    if (request.url().match("first")) body = FIRST_SCRIPT;
    else body = SECOND_SCRIPT;

    await route.fulfill({
      status: 200,
      body,
      headers: {
        "content-type": "text/plain",
      },
    });
  });

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
