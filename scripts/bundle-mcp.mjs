// scripts/bundle-mcp.mjs
import { build } from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

try {
  await build({
    entryPoints: [join(root, 'mcp/server.ts')],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: join(root, 'mcp/hud-server.cjs'),
    minify: false,
    sourcemap: false,
  })
  console.log('✓ mcp/hud-server.cjs bundled')
} catch (e) {
  console.error('✗ Build failed:', e.message)
  process.exit(1)
}
