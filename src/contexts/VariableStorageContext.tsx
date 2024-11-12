import { createContext, useContext } from "react";
import { IVariablesStorage } from "yarn-bound";

export const VariableStorageContext = createContext<IVariablesStorage | null>(
  null
);

export function useVariableStorage() {
  const variables = useContext(VariableStorageContext);

  if (!variables) {
    throw new Error(
      "useVariableStorage hook must be used within a VariableStorageContext.Provider."
    );
  }

  return variables;
}
