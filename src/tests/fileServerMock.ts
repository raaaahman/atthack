import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  http.get(`/images/*`, () => {
    return new HttpResponse(new Blob(["fake", "image"]));
  }),
];

export const fileServer = setupServer(...handlers);
