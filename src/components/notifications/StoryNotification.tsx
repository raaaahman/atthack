import { ComponentProps } from "react";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { TextResult } from "yarn-bound";
import { Immutable } from "@/types/Immutable";

type StoryNotificationProps = {
  result: Immutable<TextResult>;
};

export function StoryNotification({
  result,
  className,
  ...props
}: ComponentProps<"div"> & StoryNotificationProps) {
  const color = result.markup?.find((tag) => tag.name === "color")?.properties
    .name;

  return (
    <div
      className={clsx(
        className,
        "flex justify-between alert",
        color === "error" ? "alert-error text-error-content" : "",
        color === "success" ? "alert-success text-success-content" : "",
        color === "warning" ? "alert-warning text-warning-content" : "",
        !color ? "alert-info text-info-content" : ""
      )}
      {...props}
    >
      {result.text}
      <span className="sr-only">Close</span>
      <XMarkIcon className="size-10" title="Close" role="presentation" />
    </div>
  );
}