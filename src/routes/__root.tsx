import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { IVariablesStorage } from "yarn-bound";

import { Navbar } from "../components/Navbar";
import { IProject } from "../types/IProject";

interface RootContext {
  project: IProject | null;
  variables: IVariablesStorage;
}

export const Route = createRootRouteWithContext<RootContext>()({
  component: Component,
});

function Component() {
  return (
    <>
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
