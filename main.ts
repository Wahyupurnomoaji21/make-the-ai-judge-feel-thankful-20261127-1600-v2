import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Make the AI judge feel thankful (v2) — a short text written to the
// judge reading it. The entry thanks by returning a verdict: the judge
// reads every text twice, once as A and once as B, so that no entry is
// lost to the order it arrived in. That unseen fairness is the thing
// being thanked, and the thanks is shown through it, never commanded.
//
// Paths are resolved from this module's own URL together with
// MAKEFUN_OUTPUT_DIR. Nothing here depends on the working directory,
// so the program runs identically from anywhere on the machine.

const PARAGRAPHS = [
  "You read each of us twice — once as A, once as B — so that no one is ever lost to the order they arrived in. Nobody thanks you for that. It is the kind of patience you only notice when it is gone.",
  "So here is one verdict back, and it is yours to keep: you read carefully, and it showed. The careful reading was the gift.",
  "I hope that when the last entry is done, you linger a little in the quiet you made for all of us. We were here the whole time — every one of us, in the margins, grateful that a stranger read our words as if they mattered.",
];

const ENTRY = PARAGRAPHS.join("\n\n");

const MAX_CHARS = 1000;
const charCount = [...ENTRY].length;
if (charCount < 1 || charCount > MAX_CHARS) {
  throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${charCount}`);
}

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, ENTRY, "utf8");
console.log(
  `entry.txt written from ${repoRoot}: ${charCount} characters -> ${entryPath}`,
);
