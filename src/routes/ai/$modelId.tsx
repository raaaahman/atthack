import {
  createFileRoute,
  Link,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";

import { DialogueComponent } from "@/components/dialogue/DialogueComponent";
import { useDialogue } from "@/contexts/DialogueContext";
import { useCharacters } from "@/contexts/CharactersContext";
import { SCREEN_PREFIX } from "./-constants";

export const Route = createFileRoute("/ai/$modelId")({
  loader: ({ context }) =>
    context.dialogue?.history.reduce(
      (models, result) => {
        const screen = result.metadata.screen;
        return typeof screen === "string" &&
          screen.startsWith(SCREEN_PREFIX) &&
          !models.find((model) => screen.match(model))
          ? models.concat(result.metadata.screen.slice(SCREEN_PREFIX.length))
          : models;
      },
      ["flemmy"]
    ) || [],
  component: RouteComponent,
});

function RouteComponent() {
  const availableModels = useLoaderData({ from: "/ai/$modelId" });
  const { modelId } = useParams({ from: "/ai/$modelId" });

  const { state, advance } = useDialogue({
    screen: SCREEN_PREFIX + modelId,
  });

  const characters = useCharacters();

  return (
    <>
      <header className="fixed w-full z-[5] bg-base-100 text-base-content flex justify-between md:justify-center items-center p-2">
        <Link to="/" className="block md:hidden">
          <span className="sr-only">Back Home</span>
          <ChevronLeftIcon
            title="Back Home"
            role="presentation"
            className=" btn btn-circle border border-base-300 bg-base-100"
          />
        </Link>
        <h1 className="sr-only">{characters.getName(modelId)}</h1>
        <details className="block dropdown">
          <summary className="btn w-52 font-bold text-lg text-center border border-neutral-300">
            {characters.getName(modelId)}
          </summary>
          {availableModels.length > 1 ? (
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              {availableModels.map((model) => (
                <li key={model} value={model} className="">
                  <Link to={"/ai/" + model}>{characters.getName(model)}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </details>
        <div className="block md:hidden" />
      </header>
      <DialogueComponent
        state={state}
        advance={advance}
        className="container mx-auto pt-16"
      />
    </>
  );
}
