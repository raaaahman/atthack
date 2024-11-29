import { createFileRoute } from '@tanstack/react-router'
import { SCREEN_PREFIX } from './-constants'

export const Route = createFileRoute('/ai/$modelId')({
  loader: ({ context }) =>
    context.dialogue?.history.reduce(
      (models, result) => {
        const screen = result.metadata.screen
        return typeof screen === 'string' &&
          screen.startsWith(SCREEN_PREFIX) &&
          !models.find((model) => screen.match(model))
          ? models.concat(result.metadata.screen.slice(SCREEN_PREFIX.length))
          : models
      },
      ['flemmy'],
    ) || [],
})
