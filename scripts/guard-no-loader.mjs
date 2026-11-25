import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const failures = []
const fail = (message) => failures.push(message)

let files
try {
  files = execFileSync('git', ['ls-files', '-z'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .split('\0')
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/'))
} catch (error) {
  console.error(`GUARD FAIL: unable to list tracked files: ${error.message}`)
  process.exit(1)
}

const guardSelf = 'scripts/guard-no-loader.mjs'
const lockfile = /(^|\/)(?:package-lock\.json|pnpm-lock\.yaml|yarn\.lock|npm-shrinkwrap\.json|bun\.lockb?)$/i
const documentation = /\.(?:md|mdx)$/i
const loaderName = /^(?:init|setup|preload|bootstrap|loader|hook)(?:\.(?:cjs|mjs|js|jsx|ts|tsx|py|sh|bash|ps1))?$/i
const localScriptExtension = /\.(?:cjs|mjs|js|jsx|ts|tsx|py|sh|bash|ps1)$/i
const configFile = /(^|\/)(?:[^/]+\.config\.(?:cjs|mjs|js|ts)|tailwind\.config\.[^/]+|vite\.config\.[^/]+|webpack\.[^/]+|\.eslintrc[^/]*)$/i
const runtime = String.raw`(?:node(?:\.exe)?|nodejs|python(?:3)?|py|bash|sh|pwsh|powershell(?:\.exe)?)`
const target = String.raw`(?:"([^"]+)"|'([^']+)'|([^\s&|;]+))`
const loaderExecution = new RegExp(
  String.raw`(?:^|&&|\|\||;)\s*${runtime}\s+(?:(?:--require|-r|--import)\s+)?${target}`,
  'gi',
)
const localFilePrefix = new RegExp(
  String.raw`^\s*${runtime}\s+(?:(?:--require|-r|--import)\s+)?${target}\s*(?:&&|\|\||;)`,
  'i',
)
const configSignals = [
  ['create', 'Require'].join(''),
  'child_process',
  'eval(',
  'Function(',
  'atob(',
]
const obfuscationSignatures = [
  ['while', '(!![])'].join(''),
  ['var', 'bx ='].join(' '),
  ['Uc', 'TVHj'].join(''),
  ['VcI', 'jEMuK'].join(''),
  ['K_OvFfoTzZBpk', 'Vfumckkx'].join(''),
  ['onorewJD_sWZ', 'KC'].join(''),
  ['1,2}', '/g'].join(''),
]
const sensitiveScript = /^(?:(?:pre|post)?(?:install|build|dev|start|serve|test)|prepare)$/i
const secretTemplate = new Set(['.env.example', '.env.sample', '.env.template'])

function executesLoader(command) {
  for (const match of command.matchAll(loaderExecution)) {
    const executedPath = match[1] ?? match[2] ?? match[3] ?? ''
    if (loaderName.test(path.posix.basename(executedPath))) return true
  }
  return false
}

function hasLocalFilePrefix(command) {
  const match = command.match(localFilePrefix)
  if (!match) return false
  const executedPath = match[1] ?? match[2] ?? match[3] ?? ''
  return localScriptExtension.test(executedPath)
}

function isSecretFile(file) {
  const basename = path.posix.basename(file).toLowerCase()
  if (basename === '.env') return true
  if (basename.startsWith('.env.') && !secretTemplate.has(basename)) return true
  if (/\.(?:pem|key|p12|pfx)$/i.test(basename)) return true
  return /^service[-_]?account.*\.json$/i.test(basename)
}

function decodeText(buffer) {
  if (buffer.subarray(0, 8192).includes(0)) return null
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer)
  } catch {
    return null
  }
}

for (const file of files) {
  if (loaderName.test(path.posix.basename(file))) {
    fail(`tracked loader-named file present: ${file}`)
  }
  if (isSecretFile(file)) {
    fail(`tracked secret-like file present: ${file}`)
  }
}

for (const file of files.filter((file) => /(^|\/)package\.json$/i.test(file))) {
  try {
    const pkg = JSON.parse(readFileSync(file, 'utf8'))
    for (const [name, command] of Object.entries(pkg.scripts ?? {})) {
      if (typeof command !== 'string' || !sensitiveScript.test(name)) continue
      if (executesLoader(command) || hasLocalFilePrefix(command)) {
        fail(`unsafe local-file command in ${file} script "${name}": ${command}`)
      }
    }
  } catch (error) {
    fail(`cannot parse ${file}: ${error.message}`)
  }
}

for (const file of files) {
  if (file === guardSelf || lockfile.test(file) || documentation.test(file)) continue

  const content = decodeText(readFileSync(file))
  if (content === null) continue

  if (executesLoader(content)) {
    fail(`loader execution reference found in ${file}`)
  }
  if (configFile.test(file)) {
    const signal = configSignals.find((candidate) => content.includes(candidate))
    if (signal) fail(`loader-like config preamble in ${file}: ${signal}`)
  }

  const lines = content.split(/\r?\n/)
  const longLine = lines.findIndex((line) => line.length > 2000)
  if (longLine !== -1) {
    fail(`hidden long line in ${file}:${longLine + 1} (${lines[longLine].length} chars)`)
  }
  const paddedLine = lines.findIndex((line) => /[ \t]{200,}\S/.test(line))
  if (paddedLine !== -1) {
    fail(`whitespace-padded payload risk in ${file}:${paddedLine + 1}`)
  }

  const signature = obfuscationSignatures.find((candidate) => content.includes(candidate))
  if (signature) fail(`obfuscation signature found in ${file}: ${signature}`)
}

for (const canary of ['.env', '.env.local', '.env.production']) {
  const result = spawnSync('git', ['check-ignore', '-q', '--', canary], {
    stdio: 'ignore',
  })
  if (result.status !== 0) fail(`secret ignore canary failed: ${canary}`)
}

if (failures.length) {
  console.error(`GUARD FAIL:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log(`guard OK: scanned ${files.length} tracked files; no loader/obfuscation signals`)
