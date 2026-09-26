import { component$ } from '@builder.io/qwik'
import { useDocumentHead } from '@builder.io/qwik-city'
import { APP_NAME } from '~/lib/meta'

export const RouterHead = component$(() => {
  const head = useDocumentHead()

  return (
    <>
      <title>{head.title ? `${head.title} | ${APP_NAME}` : APP_NAME}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Hacker News reader built with Qwik City" />
      <meta name="theme-color" content="#ac7ef4" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
    </>
  )
})
