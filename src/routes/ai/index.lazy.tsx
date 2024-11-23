import { useState } from "react";
import { createLazyFileRoute, useLoaderData } from "@tanstack/react-router";

import { DialogueComponent } from "@/components/DialogueComponent";
import { useDialogue } from "@/contexts/DialogueContext";
import { useCharacters } from "@/contexts/CharactersContext";
import { SCREEN_PREFIX } from "./-constants";

export const Route = createLazyFileRoute("/ai/")({
  component: RouteComponent,
});

function RouteComponent() {
  const availableModels = useLoaderData({ from: "/ai/" });
  const [currentModel, setCurrentModel] = useState("flemmy");

  const { state, advance } = useDialogue({
    screen: SCREEN_PREFIX + currentModel,
  });

  const characters = useCharacters();

  return (
    <div className="flex-grow flex flex-col">
      <div className="w-full flex justify-center bg-neutral-100 p-2">
        <details className="dropdown">
          <summary className="btn my-2 w-52 font-bold text-lg text-center border border-neutral-300">
            {characters.getName(currentModel)}
          </summary>
          {availableModels.length > 1 ? (
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              {availableModels.map((model) => (
                <li key={model} value={model} className="">
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentModel(model);
                    }}
                  >
                    {" "}
                    {characters.getName(model)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </details>
      </div>
      <DialogueComponent state={state} advance={advance} />
    </div>
  );
}
