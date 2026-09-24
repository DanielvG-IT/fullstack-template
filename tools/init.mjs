#!/usr/bin/env node
// Renames the template placeholder in file contents AND paths:
//   Acme  → <Name>        (C# namespaces, project/solution files)
//   acme  → <kebab-name>  (npm scope @acme/*, compose project, db user)
//
// Only renames. Run it via `task init -- MyProduct`, which then reinstalls, reformats and rebuilds.
import { readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2];
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Usage: node tools/init.mjs <PascalCaseName>   e.g. MyProduct");
  process.exit(1);
}
const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const root = fileURLToPath(new URL("..", import.meta.url));
const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "bin",
  "obj",
  ".next",
  ".turbo",
  "dist",
  "coverage",
]);
const SKIP_FILES = new Set(["init.mjs"]);
const BINARY = /\.(png|jpe?g|gif|ico|webp|woff2?|ttf|eot)$/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full), full);
    else out.push(full);
  }
  return out; // children before parents, so renames never invalidate a pending path
}

const replace = (s) => s.replaceAll("Acme", name).replaceAll("acme", kebab);

const paths = walk(root);
if (!paths.some((p) => p.includes("Acme"))) {
  console.error("No 'Acme' paths found — this repo was already initialised.");
  process.exit(1);
}

let edited = 0;
for (const p of paths) {
  if (statSync(p).isDirectory() || BINARY.test(p) || SKIP_FILES.has(basename(p))) continue;
  const text = readFileSync(p, "utf8");
  const next = replace(text);
  if (next !== text) {
    writeFileSync(p, next);
    edited++;
  }
}

let renamed = 0;
for (const p of paths) {
  const base = basename(p);
  if (!/acme/i.test(base)) continue;
  renameSync(p, join(dirname(p), replace(base)));
  renamed++;
}

console.log(
  `Renamed Acme → ${name} (@${kebab}/*): ${edited} files edited, ${renamed} paths renamed.`,
);
