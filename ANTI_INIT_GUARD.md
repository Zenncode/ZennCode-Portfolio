# Anti-Init / Anti-Obfuscation Guard (any repo)

Prevents and removes one common supply-chain pattern: a small committed
loader file (`init`, `init.cjs`, `setup.js`, `preload.js`, or similar) plus an
obfuscated blob appended to a trusted file, wired into build/dev/start scripts
so every run executes the payload.

Rule 0: **never execute a suspect file to "see what it does".** Inspect statically.

## 1. Red flags (any stack, any repo)

| Signal | What to check |
|---|---|
| New top-level loader file | `init`, `init.cjs/.js`, `setup.*`, `preload.*`, `bootstrap.*` committed at repo root or package root |
| Scripts execute a local file first | `"build": "node <file> && ..."`, `"dev": "node <file> && ..."`, `preinstall/postinstall/prepare` running project code |
| Blob after whitespace padding | line(s) > 2000 chars, or hundreds of trailing spaces hiding code from editors |
| String-array decoder harness | `while(!![])`, `parseInt(0x...)`, `['push']` / `['shift']()` rotation |
| Hex/XOR string decryption | `match(/.{1,2}/g)` + `parseInt(x, 16)` + `^ key` + `TextDecoder` / `Buffer.from(x, 'hex')` |
| Loader preamble in a config file | `createRequire`, `child_process`, `eval`, `Function(`, `atob`, network calls inside `tailwind/vite/webpack/eslint/postcss/babel` configs |
| Ignore-rule regression | `.env*`, `*.pem`, `*.key`, credentials removed from `.gitignore` |
| Force-push reusing messages | same commit subjects, different hashes (`git log` subjects match, `sha` differs) |
| Config-only churn in a "fix" commit | `package.json` scripts + configs + ignore files touched by an unrelated feature commit |

Clean state: **no committed loader files, scripts invoke tools directly,
configs contain only configuration, secrets stay ignored.**

## 2. 60-second triage

```bash
# tracked loader candidates (adjust extensions to your stack)
git ls-files | grep -Ei '(^|/)(init|setup|preload|bootstrap|loader|hook)\.(cjs|mjs|js|ts|py|sh)$'

# anything executing a local file before the real command
git grep -nE '"(preinstall|postinstall|prepare|build|dev|start|serve)"[^:]*:.*(node|python|bash|sh|pwsh|powershell)[[:space:]]+[^ ]*\.(cjs|mjs|js|ts|py|sh)' -- '*.json' '*.yaml' '*.yml' '*.toml'

# files with hidden long lines (works on Linux/macOS/Windows-git-bash)
git grep -nE '.{2000,}' -- ':!package-lock.json' ':!pnpm-lock.yaml' ':!yarn.lock' | cut -c1-160
```

PowerShell equivalent for the long-line check:

```powershell
Get-ChildItem -Recurse -File -Exclude *.lock |
  Where-Object { $_.FullName -notmatch 'node_modules|\.git[\\/]|dist[\\/]|build[\\/]|coverage|\.tmp' } |
  ForEach-Object {
    foreach ($l in (Get-Content $_.FullName -ErrorAction SilentlyContinue)) {
      if ($l.Length -gt 2000) { Write-Output ("LONG: " + $_.FullName + " len=" + $l.Length); break }
    }
  }
```

Any hit → treat the checkout as **compromised**, go to §4.

## 3. Full obfuscation scan

```bash
git grep -nE 'while\(\!\!\[\]\)|var bx *=|\bUcTVHj\b|VcIjEMuK|K_OvFfoTzZBpkVfumckkx|onorewJD_sWZKC' -- ':!package-lock.json' ':!pnpm-lock.yaml' ':!yarn.lock'
git grep -nE '1,2\}/g' -- ':!package-lock.json' ':!pnpm-lock.yaml' ':!yarn.lock'
git grep -nE 'createRequire' -- '*.config.js' '*.config.ts' '*.config.mjs' 'tailwind.config.*' 'vite.config.*' 'webpack.*' '.eslintrc*'
```

Plus manual checks:

- Open each config file end-to-end — payloads hide **after** the last
  legitimate line, padded with spaces. Check file size vs. visible content
  (`wc -c` vs. what the editor shows).
- `git log --oneline -8` + `git show <sha> --stat`: a feature commit that
  also touches `package.json` scripts, configs, or `.gitignore` is suspect.
- Verify `.gitignore` still ignores secrets (`.env*`, keys, service accounts).

## 4. Containment (in this order)

1. **Stop execution:** no build/dev/start/test, no `npm install` (install
   scripts can run), no container up, no config-importing tooling.
2. **Do not pull / merge / checkout** the suspect branch or commit.
3. **Preserve evidence:** note trusted hash vs. suspect hash, keep a copy of
   the checkout before cleaning.
4. **Assume secret exposure** if ignore rules were ever relaxed: rotate DB
   URIs/passwords, API keys, JWT/session secrets, tokens, device keys, and
   anything present in local env files.
5. **Pause CI/CD** building the suspect ref until it is replaced.

## 5. Eradication

1. Delete every loader file: `git rm <file>` (never just untrack-and-leave).
2. Restore each backdoored file from the last trusted hash, e.g.
   `git show <trusted-sha>:<path>` — do not hand-edit blobs out of a 30 KB
   line; replace the whole file.
3. Remove all `<runtime> <loader> &&` prefixes from scripts so tools run
   directly (e.g. `build: tsc -p ...`, `dev: nodemon`, `start: node dist/...`).
4. Remove loader references from `Dockerfile*`, `compose*.yml`, CI workflows,
   task runners, and editor tasks.
5. Re-run §2 + §3 until zero hits. Incident write-ups describing the attack
   are the only acceptable remaining mentions.

## 6. Verification

- Scripts contain no local-file execution prefixes.
- No tracked loader files exist.
- Obfuscation scan (§3) is empty.
- Config files are short and end cleanly (no trailing code after `};` / `]`).
- Secrets are ignored (`git check-ignore .env` returns `.env`).
- Language-level check passes (e.g. `tsc --noEmit`, `vite build`,
  `python -m compileall`, `go vet`) with no changes beyond the cleanup.
- Diff the result against the trusted hash: only the malicious additions
  should be gone.

## 7. Hardening (so it cannot silently return)

1. **Branch protection:** block force-pushes on shared branches, require PR
   review. Compare **hashes**, not messages — attackers reuse subjects.
2. **CODEOWNERS** on scripts/configs/ignore/docker/CI paths
   (`package.json`, `Dockerfile*`, `*.config.*`, `.gitignore`,
   `.eslintrc*`, workflows) so execution-path changes need review.
3. **CI guard job** — fail the build on any hit (portable Node script,
   save as `scripts/guard-no-loader.mjs` and run it in CI + pre-commit):

   ```js
   import { execSync } from 'node:child_process';
   const out = (c) => { try { return execSync(c, { encoding: 'utf8' }); } catch { return ''; } };
   const fails = [];
   if (out('git ls-files').split('\n').filter(Boolean)
     .some((f) => /(^|\/)(init|setup|preload|bootstrap|loader)(\.|$)/i.test(f)))
     fails.push('tracked loader-named file present');
   for (const pat of ['node init', 'while(!![])', 'var bx =', '1,2}/g', 'createRequire']) {
     if (out(`git grep -nF '${pat}' -- .`).trim()) fails.push(`pattern found: ${pat}`);
   }
   // tune allowlists per repo (e.g. legit createRequire) instead of deleting the check
   if (fails.length) { console.error('GUARD FAIL:\n- ' + fails.join('\n- ')); process.exit(1); }
   console.log('guard OK: no loader/obfuscation signals');
   ```

4. **Ignore canary in CI:** assert `git check-ignore -q .env` (and
   equivalents per stack) succeeds.
5. **No local-file prefixes** in scripts without CODEOWNER review.
6. **Secrets hygiene:** service-account JSON and `.env*` never committed;
   prefer secret managers / CI secrets. Rotate on any suspected exposure.
7. **Recovery by replacement:** after an incident, rotate credentials first,
   then replace the remote branch from the verified hash — never merge the
   suspect head.

## 8. Decision tree

- Unexpected loader file / script prefix / config churn → §4, then §5.
- Long-line or decoder-pattern hit → replace whole file from trusted hash.
- Ignore rule relaxed → restore it, rotate secrets.
- Unclear → stop, save `git log --oneline -5` + `git diff --stat`, escalate
  before building or deploying.
