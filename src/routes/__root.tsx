import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { IVariablesStorage } from "yarn-bound";

import { CharactersRegistry } from "@/service/CharactersRegistry";
import { NotificationsCenter } from "@/components/notifications/NotificationsCenter";
import { screenName } from "@/utils";
import { Navbar } from "@/components/Navbar";
import clsx from "clsx";
import { DialogueRunner } from "@/service/DialogueRunner";
import { PostRegistry } from "@/service/Social/PostRegistry";

interface RootContext {
  variables: IVariablesStorage;
  dialogue: DialogueRunner;
  characters: CharactersRegistry;
  posts: PostRegistry;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: Component,
});

function Component() {
  const { pathname } = useLocation();

  return (
    <div className="flex">
      <aside
        className={clsx(
          "hidden h-dvh md:block",
          pathname === "/" ? "md:hidden" : ""
        )}
      >
        <Navbar />
      </aside>
      <div className="grow w-full h-dvh flex flex-col">
        <NotificationsCenter screen={screenName(pathname)} />
        <Outlet />
        {process.env.NODE_ENV === "development" ? (
          <TanStackRouterDevtools />
        ) : null}
      </div>
    </div>
  );
}
