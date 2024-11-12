import {
  createLazyFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { useRef } from "react";
import { proxy } from "valtio";
import { DialogueComponent } from "../../components/DialogueComponent";
import { useVariableStorage } from "@/contexts/VariableStorageContext";

export const Route = createLazyFileRoute("/contacts/$contactId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { contactId } = useParams({ from: "/contacts/$contactId" });
  const dialogue = useLoaderData({ from: "/contacts/$contactId" });

  const state = useRef(proxy(dialogue)).current;

  const variables = useVariableStorage();

  return (
    <>
      <h1 className="p-4 text-lg shadow-sm">
        Your conversation with{" "}
        <span className="font-semibold">
          {variables.get(`${contactId}_name`)}
        </span>
      </h1>
      <DialogueComponent state={state} />
    </>
  );
}
