import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'
import { countLines } from './loc.ts'

test('counts non-blank source lines and skips tests and other files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'loc-'))
  await mkdir(join(dir, 'lib'))
  await mkdir(join(dir, 'test'))
  await writeFile(join(dir, 'app.tsx'), 'a\n\nb\n  \nc\n')
  await writeFile(join(dir, 'lib', 'x.svelte'), 'x\ny\n')
  await writeFile(join(dir, 'lib', 'x.test.ts'), 'ignored\n')
  await writeFile(join(dir, 'test', 'fixtures.ts'), 'ignored\n')
  await writeFile(join(dir, 'logo.png'), 'ignored\n')

  expect(await countLines(dir)).toEqual({ files: 2, lines: 5 })
})
