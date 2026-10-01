import os
import shutil
import subprocess
import markdown
from generate_docx import parse_markdown_to_docx
from generate_pdf import build_styled_html, EDGE_BIN

base_dir = os.path.dirname(os.path.abspath(__file__))
drive_dir = r"G:\My Drive\001_IA_BUSINESS\00_AGENCIA"

md_path = os.path.join(base_dir, 'PROMPT_MAESTRO_CREA_TU_AGENCIA_VIRTUAL_IA.md')
html_temp = os.path.join(base_dir, 'temp_prompt_print.html')

pdf_local = os.path.join(base_dir, 'PROMPT_MAESTRO_CREA_TU_AGENCIA_VIRTUAL_IA.pdf')
pdf_drive = os.path.join(drive_dir, 'PROMPT_MAESTRO_CREA_TU_AGENCIA_VIRTUAL_IA.pdf')

docx_local = os.path.join(base_dir, 'PROMPT_MAESTRO_CREA_TU_AGENCIA_VIRTUAL_IA.docx')
docx_drive = os.path.join(drive_dir, 'PROMPT_MAESTRO_CREA_TU_AGENCIA_VIRTUAL_IA.docx')

with open(md_path, 'r', encoding='utf-8') as f:
    md_text = f.read()

# 1. Generate PDF
print("[*] Generando PDF para el Prompt Maestro...")
styled_html = build_styled_html(md_text)
with open(html_temp, 'w', encoding='utf-8') as hf:
    hf.write(styled_html)

norm_path = html_temp.replace('\\', '/')
file_url = f"file:///{norm_path}"

cmd = [
    EDGE_BIN,
    "--headless",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_local}",
    file_url
]
subprocess.run(cmd, capture_output=True)

if os.path.exists(pdf_local):
    shutil.copy2(pdf_local, pdf_drive)
    print(f"[+] PDF listo en Drive: {pdf_drive} ({os.path.getsize(pdf_drive)/1024:.1f} KB)")
else:
    print("[-] Falló generación de PDF")

# 2. Generate DOCX
print("[*] Generando DOCX para el Prompt Maestro...")
parse_markdown_to_docx(md_path, docx_local)
if os.path.exists(docx_local):
    shutil.copy2(docx_local, docx_drive)
    print(f"[+] DOCX listo en Drive: {docx_drive} ({os.path.getsize(docx_drive)/1024:.1f} KB)")
else:
    print("[-] Falló generación de DOCX")

if os.path.exists(html_temp):
    os.remove(html_temp)

print("[+] Proceso completado exitosamente.")
