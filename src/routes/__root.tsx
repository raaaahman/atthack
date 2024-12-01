import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import YarnBound, { IVariablesStorage } from "yarn-bound";

import { IProject } from "@/types/IProject";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { NotificationsCenter } from "@/components/notifications/NotificationsCenter";
import { screenName } from "@/utils";
import { Navbar } from "@/components/Navbar";
import clsx from "clsx";

interface RootContext {
  project: IProject | null;
  variables: IVariablesStorage;
  dialogue: YarnBound | null;
  characters: CharactersRegistry;
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
      <div className="grow h-dvh flex flex-col">
        <NotificationsCenter screen={screenName(pathname)} />
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  );
}
