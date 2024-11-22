import { createAvatar } from "@dicebear/core";
import { IVariablesStorage } from "yarn-bound";

import * as collections from "@dicebear/collection";

type AvatarData = {
  collection: keyof typeof collections;
  options: Record<string, string | number | boolean>;
};

type Request = {
  status: "idle" | "fetching" | "error";
  controller: AbortController;
};

const ROLE_NAMES = ["SuperAdmin", "Admin", "Teacher", "Student", "Guest"];

export class CharactersRegistry {
  _variables: IVariablesStorage;
  _avatars = new Map<string, ReturnType<typeof createAvatar>>();
  _requests = new Map<string, Request>();

  constructor(variables: IVariablesStorage) {
    this._variables = variables;
  }

  getName(characterId: string) {
    const name = this._variables.get(`${characterId}_name`);

    return typeof name === "string"
      ? name[0].toUpperCase() + name.slice(1)
      : "???";
  }

  async getAvatar(characterId: string) {
    if (this._avatars.has(characterId)) {
      return Promise.resolve(this._avatars.get(characterId));
    } else {
      try {
        const avatar = await this.preload(characterId);
        return avatar;
      } catch {
        return undefined;
      }
    }
  }

  getRole(characterId: string) {
    const variableName = `${characterId}_role`;
    const value = this._variables.get(variableName);

    return typeof value === "number" && value < ROLE_NAMES.length
      ? ROLE_NAMES[value]
      : "Guest";
  }

  async preload(characterId: string) {
    const controller = new AbortController();
    const path = `/avatars/${characterId}.json`;
    const request = { status: "fetching", controller } as Request;

    this._requests.set(`${characterId}.avatar`, request);
    try {
      const response = await fetch(path, { signal: controller.signal });
      const data = (await response.json()) as AvatarData;

      const collection = collections[data.collection];
      const avatar = createAvatar<typeof collection>(collection, data.options);

      this._avatars.set(characterId, avatar);
      request.status = "idle";

      return avatar;
    } catch (e) {
      if (!(e instanceof Error && e.message.startsWith("AbortError")))
        request.status = "error";
    }
  }

  abort(characterId: string, ...requestTypes: string[]) {
    this._requests.forEach((request, id) => {
      if (
        request.status === "fetching" &&
        requestTypes.filter((type) => id.match(characterId) && id.match(type))
          .length > 0
      )
        request.controller.abort();
    });
  }
}
