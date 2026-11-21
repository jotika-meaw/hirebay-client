// Minimal ESM resolver so plain-node scripts can use the `@/` src alias.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "@" || specifier.startsWith("@/")) {
    const rel = specifier === "@" ? "" : specifier.slice(2);
    return { url: pathToFileURL(path.join(root, "src", rel)).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
