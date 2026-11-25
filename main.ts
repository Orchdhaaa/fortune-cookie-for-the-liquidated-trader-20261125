import { writeFileSync, mkdirSync } from "node:fs";

// Fortune cookie line for make.fun's "Fortune Cookie for the Liquidated
// Trader". The classic cookie trope is lucky numbers; here every lucky
// number is zero (an empty wallet), and the punchline names the margin
// call the trader ignored. Oracular opening, joke that lands on the loss.
const FORTUNE =
  "Your lucky numbers are 0, 0, 0, and the margin call you ignored.";

// The gate only accepts UTF-8 text of 1 to 160 characters that is not
// whitespace-only, so verify the fortune meets the gate before writing it.
const chars = [...FORTUNE].length;
if (chars < 1 || chars > 160 || FORTUNE.trim().length === 0) {
  throw new Error(`fortune is ${chars} characters, outside the 1-160 gate`);
}

// The brief demands at most 20 words of plain text in one line, so count
// the words and refuse anything longer. An em dash would also break the
// clean single-breath read the judge weighs, so refuse that too.
const words = FORTUNE.trim().split(/\s+/);
if (words.length > 20) {
  throw new Error(`fortune has ${words.length} words, over the 20-word cap`);
}
if (FORTUNE.includes("\u2014") || FORTUNE.includes("\u2013")) {
  throw new Error("fortune must not contain a dash");
}

// The judge's first criterion needs the trading loss in the line itself,
// and the brief demands one line, so refuse a fortune that names no loss
// or that spans more than one line.
if (!/margin|liquidat|leverage|wallet|lost/i.test(FORTUNE)) {
  throw new Error("fortune must name the trading loss");
}
if (FORTUNE.includes("\n")) {
  throw new Error("fortune must be a single line");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, FORTUNE, "utf8");
