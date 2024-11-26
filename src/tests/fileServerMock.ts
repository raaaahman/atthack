import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.get("/images/*", () => {
    return new HttpResponse(new Blob(["fake", "image"]));
  }),
  http.get("/avatars/*", () => {
    return HttpResponse.json({
      collection: "bigSmile",
      properties: { seed: "Pulse" },
    });
  }),
];

export const fileServer = setupServer(...handlers);
