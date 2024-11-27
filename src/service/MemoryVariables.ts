import { IVariablesStorage, YarnVariableType } from "yarn-bound";

export function isVariables(obj: unknown): obj is [string, YarnVariableType][] {
  return (
    obj instanceof Array &&
    obj.reduce(
      (previous, value) =>
        previous &&
        value instanceof Array &&
        typeof value[0] === "string" &&
        ["number", "string", "boolean"].includes(typeof value[1]),
      true
    )
  );
}

export class MemoryVariables implements IVariablesStorage {
  _variables: Map<string, YarnVariableType>;

  constructor(initialVariables?: [string, YarnVariableType][]) {
    this._variables = new Map(initialVariables);
  }

  get(key: string) {
    return this._variables.get(key);
  }

  set(key: string, value: YarnVariableType) {
    this._variables.set(key, value);
  }

  toJSON() {
    return Array.from(this._variables.entries());
  }
}
