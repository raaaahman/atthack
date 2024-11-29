import { useContext, useEffect, useMemo, useState } from "react";
import YarnBound from "yarn-bound";
import { useNavigate } from "@tanstack/react-router";

import { DialogueContext } from "@/contexts/DialogueContext";
import { Immutable } from "@/types/Immutable";
import { PLAYER_ID } from "@/constants";
import { pathname } from "@/utils";
import { derive } from "derive-valtio";
import { CharacterNotification } from "./CharacterNotification";
import { StoryNotification } from "./StoryNotification";
import { useSnapshot } from "valtio";

type NotificationsCenterProps = {
  screen?: string;
};

const SCREEN_NAME = "notification";

export function NotificationsCenter({ screen }: NotificationsCenterProps) {
  const state = useContext(DialogueContext);

  if (!state) throw new Error("Dialogue has not been initialized.");

  const derived = useMemo(
    () =>
      derive({
        history: (get) => {
          return get(state.history).filter(
            (result) => result.metadata.screen === SCREEN_NAME
          );
        },
        currentResult: (get) => {
          const currentResult = get(state).currentResult;

          return (currentResult && currentResult.metadata.screen !== screen) ||
            currentResult?.metadata.screen === SCREEN_NAME
            ? currentResult
            : null;
        },
      }),
    [state]
  );

  return (
    <Notifications
      state={derived}
      screen={screen}
      advance={state.advance.bind(state)}
    />
  );
}

function Notifications({
  state,
  screen,
  advance,
}: {
  state: Pick<YarnBound, "currentResult" | "history">;
  screen?: string;
  advance: YarnBound["advance"];
}) {
  const snap = useSnapshot(state);

  const navigate = useNavigate();

  const [notification, setNotification] =
    useState<Immutable<YarnBound["currentResult"]>>(null);

  const characterId =
    typeof snap.currentResult?.metadata.screen === "string" &&
    snap.currentResult.metadata.screen.match(/conversation_(\w+)/)?.at(1);

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
          if (snap.currentResult?.metadata.screen === SCREEN_NAME) advance();
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
      {notification && characterId ? (
        <CharacterNotification
          characterId={characterId}
          className={route ? "cursor-pointer" : "cursor-auto"}
          role={route ? "link" : ""}
          onClick={
            route
              ? () => {
                  setNotification(null);
                  navigate({ to: route });
                }
              : undefined
          }
        />
      ) : null}
      {notification &&
      notification.metadata.screen === SCREEN_NAME &&
      !("options" in notification) &&
      "text" in notification ? (
        <StoryNotification
          result={notification}
          onClick={() => {
            setNotification(null);
            advance();
          }}
        />
      ) : null}
    </div>
  );
}
