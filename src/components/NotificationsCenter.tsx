import { useContext, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import YarnBound from "yarn-bound";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";

import { DialogueContext } from "@/contexts/DialogueContext";
import { Immutable } from "@/types/Immutable";
import { Avatar } from "@/components/Avatar";
import { useCharacters } from "@/contexts/CharactersContext";
import { PLAYER_ID } from "@/constants";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { pathname } from "@/utils";

type NotificationsCenterProps = {
  screen?: string;
};

export function NotificationsCenter({ screen }: NotificationsCenterProps) {
  const navigate = useNavigate();
  const state = useContext(DialogueContext);
  if (!state) throw new Error("Dialogue has not been initialized.");
  const snap = useSnapshot(state);

  const characters = useCharacters();

  const [notifcation, setNotification] =
    useState<Immutable<YarnBound["currentResult"]>>(null);

  const characterId = snap.currentResult?.markup
    ?.find((tag) => tag.name === "character")
    ?.properties.name.toLocaleLowerCase();

  useEffect(() => {
    {
      if (
        snap.currentResult &&
        characterId !== PLAYER_ID &&
        "text" in snap.currentResult &&
        snap.currentResult.metadata.screen !== screen
      ) {
        setNotification(snap.currentResult);
        const timeout = setTimeout(() => {
          setNotification(null);
        }, 3600);
        return () => clearTimeout(timeout);
      }
    }
  }, [snap.currentResult]);

  const route =
    typeof snap.currentResult?.metadata.screen === "string"
      ? pathname(snap.currentResult.metadata.screen)
      : undefined;

  return (
    <div className="toast toast-center toast-top z-10">
      {notifcation ? (
        <div
          className={clsx(
            "alert bg-secondary text-secondary-content flex justify-around",
            route ? "cursor-pointer" : "cursor-auto"
          )}
          role={route ? "link" : ""}
          onClick={
            route
              ? () => {
                  setNotification(null);
                  navigate({ to: route });
                }
              : undefined
          }
        >
          {characterId ? <Avatar characterId={characterId} /> : null}
          <div className="text-info-content">
            {characterId
              ? characters.getName(characterId) + " sent you a message."
              : "You received a new message."}
          </div>
          <span className="sr-only">Read</span>
          <ArrowUpRightIcon
            title="Read"
            role="presentation"
            className="size-12"
          />
        </div>
      ) : null}
    </div>
  );
}
