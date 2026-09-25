#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Criterio AI — Model Context Protocol (MCP) Server
=================================================
Stdio JSON-RPC 2.0 server providing native tools to Antigravity, Cursor and Claude:
- criterio_ask_specialist: Consult any of the 296 specialists.
- criterio_run_combo: Trigger one of the 8 synergistic combos.
- criterio_search_graphify: Query the Graphify knowledge graph (629 nodes, 813 links).
- criterio_list_combos: List the 8 tactical combos.
"""

import sys
import json
import os

# Redirect stdout/stderr appropriately for JSON-RPC
sys.stdin.reconfigure(encoding='utf-8')
sys.stdout.reconfigure(encoding='utf-8')

# Import core logic from criterio_query
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CURRENT_DIR)

import criterio_query

TOOLS = [
    {
        "name": "criterio_ask_specialist",
        "description": "Preguntar a cualquiera de los 296 especialistas de Criterio AI Agency según su disciplina, herramientas y rol.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "agent": {
                    "type": "string",
                    "description": "ID o nombre del especialista (ej: frontend, specialized-pricing-analyst, lead-gen, ui-finish)"
                },
                "question": {
                    "type": "string",
                    "description": "Pregunta o tarea específica a consultar"
                }
            },
            "required": ["agent", "question"]
        }
    },
    {
        "name": "criterio_run_combo",
        "description": "Ejecutar uno de los 8 combos de habilidades sinérgicas de Criterio AI, generando entregables en tasks/ y actualizando la cola de ejecución.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "combo_id": {
                    "type": "string",
                    "description": "ID del combo (ej: combo-web-killer, combo-bogota-closers, combo-viral-growth, combo-mobile-speed, combo-mrr-retention, combo-brand-fortress, combo-smart-automation, combo-governance-strategy)"
                },
                "custom_goal": {
                    "type": "string",
                    "description": "Objetivo específico opcional para la misión"
                }
            },
            "required": ["combo_id"]
        }
    },
    {
        "name": "criterio_search_graphify",
        "description": "Buscar en el grafo de conocimiento Graphify de 00_AGENCIA (629 nodos, 813 conexiones, 142 comunidades) para hallar dependencias, bloqueantes y decisiones comerciales.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Término a buscar (ej: Netlify, WhatsApp, Bogotá, Carta Viva, Ley 1581)"
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "criterio_list_combos",
        "description": "Listar los 8 combos de sinergias tácticas disponibles con sus agentes y objetivos.",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    }
]

def send_response(response):
    body = json.dumps(response, ensure_ascii=False)
    sys.stdout.write(body + "\n")
    sys.stdout.flush()

def handle_request(req):
    msg_id = req.get("id")
    method = req.get("method")
    params = req.get("params", {})

    if method == "initialize":
        send_response({
            "jsonrpc": "2.0",
            "id": msg_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "criterio-agency-mcp",
                    "version": "1.0.0"
                }
            }
        })
    elif method == "notifications/initialized":
        pass
    elif method == "tools/list":
        send_response({
            "jsonrpc": "2.0",
            "id": msg_id,
            "result": {
                "tools": TOOLS
            }
        })
    elif method == "tools/call":
        name = params.get("name")
        args = params.get("arguments", {})

        try:
            if name == "criterio_ask_specialist":
                agent = args.get("agent", "")
                question = args.get("question", "")
                res_text = criterio_query.ask_specialist(agent, question)
            elif name == "criterio_run_combo":
                combo_id = args.get("combo_id", "")
                goal = args.get("custom_goal", "")
                criterio_query.run_combo(combo_id, goal)
                res_text = f"Combo {combo_id} ejecutado exitosamente. Entregables generados en tasks/ y cola AI_EXECUTION_QUEUE.md actualizada."
            elif name == "criterio_search_graphify":
                query = args.get("query", "")
                res_dict = criterio_query.query_graph(query)
                res_text = json.dumps(res_dict, indent=2, ensure_ascii=False)
            elif name == "criterio_list_combos":
                res_dict = criterio_query.COMBOS
                res_text = json.dumps(res_dict, indent=2, ensure_ascii=False)
            else:
                res_text = f"Herramienta desconocida: {name}"

            send_response({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": res_text
                        }
                    ]
                }
            })
        except Exception as e:
            send_response({
                "jsonrpc": "2.0",
                "id": msg_id,
                "error": {
                    "code": -32603,
                    "message": str(e)
                }
            })
    else:
        if msg_id is not None:
            send_response({
                "jsonrpc": "2.0",
                "id": msg_id,
                "error": {
                    "code": -32601,
                    "message": f"Método no encontrado: {method}"
                }
            })

def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            handle_request(req)
        except Exception as e:
            sys.stderr.write(f"Error procesando JSON-RPC: {e}\n")
            sys.stderr.flush()

if __name__ == '__main__':
    main()
