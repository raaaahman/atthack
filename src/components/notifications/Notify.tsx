import { ComponentProps } from "react";
import YarnBound from "yarn-bound";
import { useLocation } from "@tanstack/react-router";
import clsx from "clsx";

import { Immutable } from "@/types/Immutable";
import { PLAYER_ID } from "@/constants";
import { pathname as getPathname } from "@/utils";

type NotifyProps = {
  route: string;
  result: Immutable<YarnBound["currentResult"]>;
};

export function Notify({
  route,
  result,
  children,
  className,
  ...props
}: ComponentProps<"div"> & NotifyProps) {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <div className={clsx("indicator", className)} {...props}>
      {!pathname.startsWith(route) &&
      typeof result?.metadata.screen === "string" &&
      getPathname(result.metadata.screen)?.startsWith(route) &&
      result?.markup
        ?.find((tag) => tag.name === "character")
        ?.properties.name.toLowerCase() !== PLAYER_ID &&
      !("options" in result) &&
      !("command" in result) ? (
        <span className="indicator-item badge badge-secondary">1</span>
      ) : null}
      {children}
    </div>
  );
}
