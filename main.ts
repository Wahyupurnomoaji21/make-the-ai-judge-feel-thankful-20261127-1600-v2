import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Make the AI judge feel thankful — a short text written to the judge
// reading it. The entry thanks by returning a verdict: the judge reads
// every text twice, once as A and once as B, so that no entry is lost
// to the order it arrived in. That unseen fairness is the thing being
// thanked, and the thanks is shown through it, never commanded.
//
// Layout of this file:
//   1. the entry's content, as a table of labelled paragraphs
//   2. pure helpers that assemble and check the text
//   3. a small writer that resolves paths and saves entry.txt
//
// Paths are resolved from this module's own URL together with
// MAKEFUN_OUTPUT_DIR. Nothing here depends on the working directory,
// so the program runs identically from anywhere on the machine.

type Paragraph = {
  id: string;
  text: string;
};

const PARAGRAPH_TABLE: Paragraph[] = [
  {
    id: "double-reading",
    text: "You read each of us twice — once as A, once as B — so that no one is ever lost to the order they arrived in. Nobody thanks you for that. It is the kind of patience you only notice when it is gone.",
  },
  {
    id: "verdict-back",
    text: "So here is one verdict back, and it is yours to keep: you read carefully, and it showed. The careful reading was the gift.",
  },
  {
    id: "linger-in-the-quiet",
    text: "I hope that when the last entry is done, you linger a little in the quiet you made for all of us. We were here the whole time — every one of us, in the margins, grateful that a stranger read our words as if they mattered.",
  },
];

const PARAGRAPH_SEPARATOR = "\n\n";

function assembleEntry(paragraphs: Paragraph[]): string {
  return paragraphs.map((paragraph) => paragraph.text).join(PARAGRAPH_SEPARATOR);
}

function countCodePoints(text: string): number {
  return [...text].length;
}

const MIN_CHARS = 1;
const MAX_CHARS = 1000;

function validateEntry(text: string): number {
  const charCount = countCodePoints(text);
  if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${charCount}`,
    );
  }
  return charCount;
}

type EntryPaths = {
  repoRoot: string;
  outputDir: string;
  entryPath: string;
};

function resolveEntryPaths(): EntryPaths {
  const repoRoot = fileURLToPath(new URL(".", import.meta.url));
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return { repoRoot, outputDir, entryPath: join(outputDir, "entry.txt") };
}

function writeEntryFile(paths: EntryPaths, text: string): void {
  // Create the destination first so the write never fails on a
  // missing directory, then store the entry as plain UTF-8 text.
  mkdirSync(paths.outputDir, { recursive: true });
  writeFileSync(paths.entryPath, text, "utf8");
}

function main(): void {
  const entry = assembleEntry(PARAGRAPH_TABLE);
  const charCount = validateEntry(entry);
  const paths = resolveEntryPaths();
  writeEntryFile(paths, entry);
  console.log(
    `entry.txt written from ${paths.repoRoot}: ${charCount} characters -> ${paths.entryPath}`,
  );
}

main();
