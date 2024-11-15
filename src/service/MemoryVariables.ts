import { IVariablesStorage, YarnVariableType } from "yarn-bound";

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
