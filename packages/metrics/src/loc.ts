import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const SOURCE = /\.(ts|tsx|js|jsx|vue|svelte|css)$/
const TEST = /\.test\.|(^|\/)test\//

/** Non-blank lines of hand-written source under `dir`, tests excluded. */
export async function countLines(dir: string): Promise<{ files: number; lines: number }> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  let files = 0
  let lines = 0
  for (const entry of entries) {
    const path = join(entry.parentPath, entry.name)
    if (!entry.isFile() || !SOURCE.test(entry.name) || TEST.test(path.slice(dir.length))) continue
    const text = await readFile(path, 'utf8')
    files++
    lines += text.split('\n').filter((line) => line.trim()).length
  }
  return { files, lines }
}
