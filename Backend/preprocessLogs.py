import sys
import pandas as pd
import re

# ✅ FINAL COLUMN ORDER
OUTPUT_COLUMNS = [
    "Date and Time",
    "Event ID",
    "Level",
    "Source",
    "UtcTime",
    "Process Name",
    "Process Path",
    "Process ID",
    "Parent Process Name",
    "Command Line",
    "User / Integrity Level",
    "Hashes",
]

def find_raw_column(df):
    for col in df.columns:
        if "Unnamed" in str(col):
            return col

    for col in df.columns:
        sample = df[col].astype(str).head(20)
        if sample.str.contains(r"[A-Za-z]+: ").sum() > 10:
            return col

    raise Exception("Raw column not found")

def parse_body(raw):
    if not isinstance(raw, str):
        return {}

    raw = raw.replace("\r\n", "\n").replace("\r", "\n")

    result = {}
    lines = raw.split("\n")

    current_key = ""
    current_value = []

    for line in lines:
        match = re.match(r"^([A-Za-z0-9]+):\s*(.*)", line)

        if match:
            if current_key:
                result[current_key] = " ".join(current_value).strip()

            current_key = match.group(1)
            current_value = [match.group(2)]
        else:
            current_value.append(line.strip())

    if current_key:
        result[current_key] = " ".join(current_value).strip()

    return result

def preprocess(input_path, output_path):
    print("🔥 PYTHON SCRIPT STARTED")

    df = pd.read_csv(input_path, dtype=str, low_memory=False)

    # 🔥 FIX COLUMN SHIFTING (CRITICAL)
    df["Real_Date"] = df["Level"]
    df["Real_Source"] = df["Date and Time"]
    df["Real_EventID"] = df["Source"]

    # 🔥 RAW BODY COLUMN
    raw_col = "Task Category" if "Task Category" in df.columns else find_raw_column(df)

    records = []

    for _, row in df.iterrows():
        record = {}

        body = parse_body(row.get(raw_col, ""))

        # ✅ FINAL STRUCTURE (ORDER MATTERS)
        record["Date and Time"] = row.get("Real_Date", "")
        record["Event ID"] = row.get("Real_EventID", "")
        record["Level"] = "Information"  # constant in your logs
        record["Source"] = row.get("Real_Source", "")

        record["UtcTime"] = body.get("UtcTime", "")

        image = body.get("Image", "")
        record["Process Name"] = image
        record["Process Path"] = image

        record["Process ID"] = body.get("ProcessId", "")
        record["Parent Process Name"] = body.get("ParentImage", "")
        record["Command Line"] = body.get("CommandLine", "")

        user = body.get("User", "")
        integrity = body.get("IntegrityLevel", "")
        # record["User / Integrity Level"] = f"{user} | {integrity}".strip(" |")
        record["User / Integrity Level"] = f"{user} | {integrity}".strip(" |")

        record["Hashes"] = body.get("Hashes", "")

        records.append(record)

    df_out = pd.DataFrame(records, columns=OUTPUT_COLUMNS).fillna("")

    df_out.to_csv(output_path, index=False)

    print("✅ PREPROCESSING DONE")

if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    preprocess(input_file, output_file)