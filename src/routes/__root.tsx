import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import YarnBound, { IVariablesStorage } from "yarn-bound";

import { Navbar } from "@/components/Navbar";
import { IProject } from "@/types/IProject";
import { CharactersRegistry } from "@/service/CharactersRegistry";
import { NotificationsCenter } from "@/components/NotificationsCenter";
import { screenName } from "@/utils";

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
    <>
      <NotificationsCenter screen={screenName(pathname)} />
      <header className="order-3">
        <Navbar />
      </header>
      <main className="flex-grow flex flex-col order-1">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
