import json

base_path = r"C:\Users\onaga\.antigravity-cuenta2\.gemini\antigravity\scratch\ai-criterio-agency"

with open(f"{base_path}\\agents_summary.json", "r", encoding="utf-8") as f:
    summary_data = f.read()

with open(f"{base_path}\\js\\agents_data.js", "w", encoding="utf-8") as f:
    f.write("window.AGENTS_SUMMARY_DATA = " + summary_data + ";\n")

with open(f"{base_path}\\agents_database.json", "r", encoding="utf-8") as f:
    full_data = f.read()

with open(f"{base_path}\\js\\agents_full_data.js", "w", encoding="utf-8") as f:
    f.write("window.AGENTS_FULL_DATA = " + full_data + ";\n")

print("Successfully exported agents_data.js and agents_full_data.js")
