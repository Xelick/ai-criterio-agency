import os
import sys
import glob

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

tasks = sorted(glob.glob('tasks/*.md'))
print(f"Total de tareas encontradas: {len(tasks)}\n")

for t in tasks:
    fname = os.path.basename(t)
    with open(t, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    meta = {}
    in_yaml = False
    body_lines = []
    
    for l in lines:
        if l.strip() == '---':
            if not in_yaml:
                in_yaml = True
                continue
            else:
                in_yaml = False
                continue
        if in_yaml:
            if ':' in l:
                k, v = l.split(':', 1)
                meta[k.strip()] = v.strip().strip('"\'')
        else:
            body_lines.append(l)

    print(f"======================================================================")
    print(f"📄 ARCHIVO: {fname}")
    print(f"👤 ESPECIALISTA: {meta.get('agent_name', 'N/A')} ({meta.get('agent_id', '')})")
    print(f"🎯 TITULO: {meta.get('title', meta.get('mission', ''))}")
    print(f"📊 ESTADO: {meta.get('status', 'PENDIENTE')}")
    print(f"🎯 MISIÓN: {meta.get('mission', '')}")
    
    # Extract core diagnostic snippet
    body_text = '\n'.join(body_lines)
    for section in ["## Contexto y Diagnóstico", "## 1. Prompt de Ejecución", "## Diagnóstico", "###"]:
        if section in body_text:
            pos = body_text.find(section)
            snippet = body_text[pos:pos+400].replace('\n', ' ')
            print(f"📝 DETALLE: {snippet[:250]}...")
            break
print("======================================================================")
