import '@repo/hn-styles/index.css'
import './app.css'
import { MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { HttpStatusCode } from '@solidjs/start'
import { ErrorBoundary, onMount, Suspense } from 'solid-js'
import { Header } from './components/header'
import { hidden, read } from './lib/prefs'
import { pageTitle } from './lib/meta'

export default function App() {
  onMount(() => {
    hidden.load()
    read.load()
  })

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="app">
            <Header />
            <main class="main">
              <ErrorBoundary
                fallback={() => (
                  <div class="status">
                    <HttpStatusCode code={502} />
                    <Title>{pageTitle('Something went wrong')}</Title>
                    <h1>Something went wrong</h1>
                    <p>
                      Hacker News may be slow right now. <a href="/">Back to top stories</a>
                    </p>
                  </div>
                )}
              >
                <Suspense>{props.children}</Suspense>
              </ErrorBoundary>
            </main>
            <footer class="footer">
              ©{new Date().getFullYear()} Karsanda ·{' '}
              <a href="https://github.com/karsanda/monorepo/tree/main/apps/hackernews-solid">
                Source
              </a>
            </footer>
          </div>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
