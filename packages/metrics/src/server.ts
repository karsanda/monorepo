import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

/** Runs `command` in `cwd`, returning how long it took in seconds; throws if it fails. */
export function timeCommand(command: string, cwd: string): number {
  const start = performance.now()
  const result = spawnSync('sh', ['-c', command], { cwd, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`\`${command}\` failed in ${cwd}`)
  return (performance.now() - start) / 1000
}

/** Starts `command` in its own process group and waits until `url` answers. */
export async function startServer(command: string, cwd: string, url: string) {
  const child = spawn('sh', ['-c', `exec ${command}`], { cwd, stdio: 'ignore', detached: true })
  const stop = () => {
    try {
      process.kill(-child.pid!, 'SIGTERM')
    } catch {
      // Already gone.
    }
  }
  for (let i = 0; i < 120; i++) {
    if (child.exitCode !== null) throw new Error(`\`${command}\` exited with ${child.exitCode}`)
    try {
      await fetch(url)
      return stop
    } catch {
      await sleep(500)
    }
  }
  stop()
  throw new Error(`${url} didn't come up within 60 s`)
}
