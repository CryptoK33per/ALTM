import { parse } from "csv-parse/sync";

/* -----------------------------
   CONFIG
----------------------------- */

const META_COLS = ["Level", "Date and Time", "Source", "Event ID"];

const BODY_FIELD_MAP: Record<string, string> = {
  UtcTime: "UtcTime",
  Image: "Process Name (Image)",
  ProcessId: "Process ID",
  CommandLine: "Command Line",
  ParentImage: "Parent Process Name",
  Hashes: "Hashes",
};

const OUTPUT_COLUMNS = [
  "Level",
  "Date and Time",
  "Source",
  "Event ID",
  "UtcTime",
  "Process Name (Image)",
  "Process ID",
  "Command Line",
  "Parent Process Name",
  "Hashes",
];

/* -----------------------------
   HELPERS
----------------------------- */

// 🔍 Find raw body column
function findRawBodyColumn(rows: any[]): string {
  if (!rows.length) throw new Error("Empty CSV");

  const columns = Object.keys(rows[0]);

  // Strategy 1 → Unnamed column
  for (const col of columns) {
    if (/^Unnamed/i.test(col)) {
      console.log("Raw column (Unnamed):", col);
      return col;
    }
  }

  // Strategy 2 → heuristic (contains key:value)
  for (const col of columns) {
    if (META_COLS.includes(col)) continue;

    const sample = rows.slice(0, 20).map(r => String(r[col] || ""));

    const count = sample.reduce((acc, val) => {
      return acc + ((val.match(/[A-Za-z]+:\s/g) || []).length);
    }, 0);

    if (count > 10) {
      console.log("Raw column (heuristic):", col);
      return col;
    }
  }

  throw new Error("Raw Sysmon body column not found");
}

// 🧠 Parse raw body into key-value
function parseBody(raw: string): Record<string, string> {
  if (!raw || typeof raw !== "string") return {};

  const normalized = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const parts = normalized.split(/\n([A-Za-z][A-Za-z0-9]*):\s*/);

  const result: Record<string, string> = {};

  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i]?.trim();
    const value = parts[i + 1]?.trim();

    if (key) result[key] = value;
  }

  return result;
}

// 🧩 Build final structured record
function buildRecord(row: any, rawCol: string) {
  const record: any = {};

  // Meta fields
  for (const col of META_COLS) {
    record[col] = row[col] || "";
  }

  // Body fields
  const body = parseBody(row[rawCol] || "");

  for (const [rawKey, outKey] of Object.entries(BODY_FIELD_MAP)) {
    record[outKey] = body[rawKey] || "";
  }

  return record;
}

/* -----------------------------
   MAIN FUNCTION
----------------------------- */

export function preprocessRawSysmon(content: string) {
  // Step 1: Parse CSV
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    relax_quotes: true,
  });

  if (!rows.length) return [];

  // Step 2: Find raw column
  const rawCol = findRawBodyColumn(rows);

  // Step 3: Convert each row
  const processed = rows.map((row: any) =>
    buildRecord(row, rawCol)
  );

  // Step 4: Ensure column consistency
  return processed.map((row: any) => {
    const clean: any = {};
    for (const col of OUTPUT_COLUMNS) {
      clean[col] = row[col] || "";
    }
    return clean;
  });
}