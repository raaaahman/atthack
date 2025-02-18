import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import YarnBound, { IVariablesStorage } from "yarn-bound";

import { CharactersRegistry } from "@/service/CharactersRegistry";
import { NotificationsCenter } from "@/components/notifications/NotificationsCenter";
import { screenName } from "@/utils";
import { Navbar } from "@/components/Navbar";
import clsx from "clsx";

interface RootContext {
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
