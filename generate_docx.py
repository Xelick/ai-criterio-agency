import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MD_FILE = os.path.join(BASE_DIR, 'GUIA_SETUP_AGENCIA_VIRTUAL.md')

OUTPUT_DOCX_LOCAL = os.path.join(BASE_DIR, 'GUIA_SETUP_AGENCIA_VIRTUAL.docx')
DRIVE_DIR = r"G:\My Drive\001_IA_BUSINESS\00_AGENCIA"
OUTPUT_DOCX_DRIVE = os.path.join(DRIVE_DIR, 'GUIA_SETUP_AGENCIA_IA_VIRTUAL_296_AGENTES.docx')

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_code_block(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    pPr = p._p.get_or_add_pPr()
    # Add light gray shading to code paragraph
    pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:left w:val="single" w:sz="18" w:space="8" w:color="0284C7"/></w:pBdr>')
    pShd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="0F172A"/>')
    pPr.append(pBdr)
    pPr.append(pShd)
    
    run = p.add_run(text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(248, 250, 252) # Light white

def parse_markdown_to_docx(md_path, docx_path):
    print(f"[*] Parseando {md_path} a Word DOCX...")
    doc = docx.Document()

    # Set margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Set Normal Style font
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Segoe UI'
    style_normal.font.size = Pt(10.5)
    style_normal.font.color.rgb = RGBColor(30, 41, 59)

    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code_block = False
    code_buffer = []
    in_table = False
    table_rows = []

    def flush_table():
        nonlocal in_table, table_rows
        if not table_rows:
            in_table = False
            return
        
        # Determine cols
        num_cols = max(len(r) for r in table_rows)
        tbl = doc.add_table(rows=len(table_rows), cols=num_cols)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        for r_idx, row_data in enumerate(table_rows):
            is_header = (r_idx == 0)
            row = tbl.rows[r_idx]
            for c_idx in range(num_cols):
                cell = row.cells[c_idx]
                val = row_data[c_idx] if c_idx < len(row_data) else ""
                cell.text = val
                set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
                
                # Format cell text
                cp = cell.paragraphs[0]
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(2)
                for run in cp.runs:
                    run.font.name = 'Segoe UI'
                    run.font.size = Pt(9.5)
                    if is_header:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
                    else:
                        run.font.color.rgb = RGBColor(30, 41, 59)

                if is_header:
                    set_cell_background(cell, "0F172A")
                elif r_idx % 2 == 1:
                    set_cell_background(cell, "F8FAFC")
                else:
                    set_cell_background(cell, "FFFFFF")

        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_after = Pt(6)
        table_rows = []
        in_table = False

    i = 0
    while i < len(lines):
        line = lines[i].rstrip('\r\n')
        stripped = line.strip()

        # Handle fenced code block
        if stripped.startswith('```'):
            if in_code_block:
                add_code_block(doc, '\n'.join(code_buffer))
                code_buffer = []
                in_code_block = False
            else:
                if in_table: flush_table()
                in_code_block = True
                code_buffer = []
            i += 1
            continue

        if in_code_block:
            code_buffer.append(line)
            i += 1
            continue

        # Handle tables
        if '|' in stripped and ('---' in stripped or stripped.startswith('|')):
            if not in_table:
                in_table = True
                table_rows = []
            
            # Skip separator line
            if re.match(r'^[\|\s\-\:\+]+$', stripped):
                i += 1
                continue
            
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            table_rows.append(cells)
            i += 1
            continue
        elif in_table:
            flush_table()

        # Handle blank lines
        if not stripped:
            i += 1
            continue

        # Headers
        if stripped.startswith('# '):
            h = doc.add_heading(level=1)
            h.paragraph_format.space_before = Pt(20)
            h.paragraph_format.space_after = Pt(8)
            run = h.add_run(stripped[2:])
            run.font.name = 'Segoe UI'
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42) # #0F172A
        elif stripped.startswith('## '):
            h = doc.add_heading(level=2)
            h.paragraph_format.space_before = Pt(16)
            h.paragraph_format.space_after = Pt(6)
            run = h.add_run(stripped[3:])
            run.font.name = 'Segoe UI'
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(2, 132, 199) # #0284C7
        elif stripped.startswith('### '):
            h = doc.add_heading(level=3)
            h.paragraph_format.space_before = Pt(12)
            h.paragraph_format.space_after = Pt(4)
            run = h.add_run(stripped[4:])
            run.font.name = 'Segoe UI'
            run.font.size = Pt(12)
            run.font.bold = True
            run.font.color.rgb = RGBColor(51, 65, 85) # #334155

        # Blockquote
        elif stripped.startswith('> '):
            p = doc.add_paragraph()
            p.paragraph_format.left_indent = Inches(0.3)
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(stripped[2:])
            run.font.italic = True
            run.font.color.rgb = RGBColor(71, 85, 105)

        # Bullet list
        elif stripped.startswith('- ') or stripped.startswith('* '):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            # Parse bold inside bullet
            text_body = stripped[2:]
            parts = re.split(r'(\*\*.*?\*\*)', text_body)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                else:
                    p.add_run(part)

        # Numbered list
        elif re.match(r'^\d+\.\s', stripped):
            m = re.match(r'^\d+\.\s(.*)', stripped)
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            text_body = m.group(1) if m else stripped
            parts = re.split(r'(\*\*.*?\*\*)', text_body)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                else:
                    p.add_run(part)

        # Horizontal rule
        elif stripped in ['---', '***', '___']:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(8)
            r = p.add_run("―" * 55)
            r.font.color.rgb = RGBColor(203, 213, 225)

        # Regular Paragraph
        else:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(6)
            # Parse inline bold and code
            parts = re.split(r'(\*\*.*?\*\*|`.*?`)', stripped)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    r = p.add_run(part[1:-1])
                    r.font.name = 'Consolas'
                    r.font.size = Pt(9.5)
                    r.font.color.rgb = RGBColor(2, 132, 199)
                else:
                    p.add_run(part)

        i += 1

    if in_table: flush_table()
    if in_code_block:
        add_code_block(doc, '\n'.join(code_buffer))

    print(f"[*] Guardando {docx_path}...")
    doc.save(docx_path)
    size_kb = os.path.getsize(docx_path) / 1024
    print(f"[+] Archivo DOCX generado exitosamente: {docx_path} ({size_kb:.1f} KB)")

if __name__ == '__main__':
    parse_markdown_to_docx(MD_FILE, OUTPUT_DOCX_LOCAL)
    if os.path.exists(DRIVE_DIR):
        import shutil
        shutil.copy2(OUTPUT_DOCX_LOCAL, OUTPUT_DOCX_DRIVE)
        drive_kb = os.path.getsize(OUTPUT_DOCX_DRIVE) / 1024
        print(f"[+] DOCX copiado a Google Drive: {OUTPUT_DOCX_DRIVE} ({drive_kb:.1f} KB)")
