import os
import sys
import webbrowser
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn

# Fix Windows console encoding for UTF-8
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class PixelAgencyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        return super().guess_type(path)

def find_free_port(start_port=8080):
    for port in range(start_port, start_port + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('127.0.0.1', port))
                return port
            except OSError:
                continue
    return start_port

def run_server():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)
    port = find_free_port(8080)
    server_address = ('127.0.0.1', port)
    
    httpd = ThreadingHTTPServer(server_address, PixelAgencyHandler)
    url = f"http://localhost:{port}"

    print("=" * 65)
    print("   [+] AI_CRITERIO - VIRTUAL PIXEL ART AGENCY HEADQUARTERS")
    print("=" * 65)
    print(f"  -> Servidor local activo en: {url}")
    print(f"  -> Total de agentes cargados: 296 especialistas")
    print(f"  -> Pisos disponibles: P1 a P5 (Lobby, Tech, Design, Research, Penthouse)")
    print("=" * 65)
    print("  Abriendo la oficina en tu navegador web...")
    print("  Presiona Ctrl+C en cualquier momento para detener el servidor.\n")

    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"  Abre manualmente tu navegador en: {url}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Servidor detenido con éxito. Hasta pronto!")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
