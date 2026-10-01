import os
import sys
import subprocess
import markdown

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MD_FILE = os.path.join(BASE_DIR, 'GUIA_SETUP_AGENCIA_VIRTUAL.md')
HTML_TEMP = os.path.join(BASE_DIR, 'temp_guide_print.html')

OUTPUT_PDF_LOCAL = os.path.join(BASE_DIR, 'GUIA_SETUP_AGENCIA_VIRTUAL.pdf')
DRIVE_DIR = r"G:\My Drive\001_IA_BUSINESS\00_AGENCIA"
OUTPUT_PDF_DRIVE = os.path.join(DRIVE_DIR, 'GUIA_SETUP_AGENCIA_IA_VIRTUAL_296_AGENTES.pdf')

EDGE_BIN = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def build_styled_html(md_text):
    html_body = markdown.markdown(
        md_text,
        extensions=['tables', 'fenced_code', 'nl2br']
    )

    styled_html = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Guía Maestra: Setup Agencia Virtual IA</title>
    <style>
        @page {{
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {{
                content: counter(page);
            }}
        }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            font-size: 11pt;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }}

        h1 {{
            color: #0f172a;
            font-size: 20pt;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 8px;
            margin-top: 24pt;
            margin-bottom: 12pt;
            page-break-after: avoid;
        }}

        h2 {{
            color: #0369a1;
            font-size: 15pt;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 20pt;
            margin-bottom: 10pt;
            page-break-after: avoid;
        }}

        h3 {{
            color: #334155;
            font-size: 12.5pt;
            margin-top: 14pt;
            margin-bottom: 6pt;
            page-break-after: avoid;
        }}

        p {{
            margin-top: 0;
            margin-bottom: 8pt;
            text-align: justify;
        }}

        blockquote {{
            background: #f8fafc;
            border-left: 4px solid #0284c7;
            margin: 12pt 0;
            padding: 8pt 14pt;
            color: #475569;
            font-style: italic;
            border-radius: 0 4px 4px 0;
        }}

        code {{
            font-family: "Consolas", "Courier New", monospace;
            background: #f1f5f9;
            color: #0f172a;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 9.5pt;
        }}

        pre {{
            background: #0f172a;
            color: #f8fafc;
            padding: 12pt;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 9pt;
            line-height: 1.45;
            page-break-inside: avoid;
            margin: 10pt 0;
        }}

        pre code {{
            background: transparent;
            color: #f8fafc;
            padding: 0;
            border-radius: 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
            font-size: 9.5pt;
            page-break-inside: avoid;
        }}

        th {{
            background: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
        }}

        td {{
            padding: 7px 10px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
        }}

        tr:nth-child(even) {{
            background: #f8fafc;
        }}

        ul, ol {{
            margin-top: 0;
            margin-bottom: 8pt;
            padding-left: 20px;
        }}

        li {{
            margin-bottom: 4pt;
        }}

        hr {{
            border: 0;
            border-top: 1px solid #cbd5e1;
            margin: 18pt 0;
        }}

        .cover-header {{
            background: linear-gradient(135deg, #0f172a, #1e293b);
            color: #ffffff;
            padding: 24pt;
            border-radius: 8px;
            margin-bottom: 24pt;
            border-left: 6px solid #10b981;
        }}

        .cover-title {{
            font-size: 22pt;
            font-weight: 800;
            margin: 0 0 10pt 0;
            color: #38bdf8;
            line-height: 1.25;
        }}

        .cover-meta {{
            font-size: 10.5pt;
            color: #cbd5e1;
            line-height: 1.6;
        }}

        .tag {{
            display: inline-block;
            background: #0284c7;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 8.5pt;
            font-weight: 600;
            margin-right: 6px;
        }}
    </style>
</head>
<body>
    <div class="cover-header">
        <div class="cover-title">🏢 GUÍA MAESTRA: AGENCIA VIRTUAL IA</div>
        <div class="cover-meta">
            <span class="tag">ARQUITECTURA 2.5.0</span>
            <span class="tag">296 AGENTES</span>
            <span class="tag">CANVAS 2D 60 FPS</span>
            <span class="tag">RADAR WEB EN VIVO</span>
            <br><br>
            <strong>Proyecto:</strong> Criterio AI — Cuartel General de Agentes Autónomos<br>
            <strong>Destinatarios:</strong> Guía de Implementación y Transferencia Técnica para Creadores e IAs Ejecutoras
        </div>
    </div>

    {html_body}
</body>
</html>
"""
    return styled_html

def convert_to_pdf():
    print("[*] Leyendo archivo Markdown...")
    with open(MD_FILE, 'r', encoding='utf-8') as f:
        md_text = f.read()

    print("[*] Generando HTML estilizado con tipografía ejecutiva...")
    styled_html = build_styled_html(md_text)
    with open(HTML_TEMP, 'w', encoding='utf-8') as hf:
        hf.write(styled_html)

    print(f"[*] Ejecutando Microsoft Edge headless para imprimir a PDF...")
    # Convert file path to file:// URL
    file_url = f"file:///{HTML_TEMP.replace(os.sep, '/')}"

    cmd = [
        EDGE_BIN,
        "--headless",
        "--disable-gpu",
        "--allow-file-access-from-files",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={OUTPUT_PDF_LOCAL}",
        file_url
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(OUTPUT_PDF_LOCAL):
        size_kb = os.path.getsize(OUTPUT_PDF_LOCAL) / 1024
        print(f"[+] PDF local generado exitosamente: {OUTPUT_PDF_LOCAL} ({size_kb:.1f} KB)")
        
        # Copy to Google Drive
        if os.path.exists(DRIVE_DIR):
            import shutil
            shutil.copy2(OUTPUT_PDF_LOCAL, OUTPUT_PDF_DRIVE)
            drive_size = os.path.getsize(OUTPUT_PDF_DRIVE) / 1024
            print(f"[+] PDF copiado a Google Drive: {OUTPUT_PDF_DRIVE} ({drive_size:.1f} KB)")
        else:
            print(f"[!] Google Drive no accesible en {DRIVE_DIR}")
    else:
        print(f"[-] Error al generar PDF: {res.stderr}")

if __name__ == '__main__':
    convert_to_pdf()
