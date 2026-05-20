#!/usr/bin/env python3
"""
Dev server: static files + training logs printed to this terminal (CMD).

Usage (from web/):
  python dev_server.py
  Open http://127.0.0.1:5500/#/dashboard
"""
from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", "5500"))
WEB_DIR = os.path.dirname(os.path.abspath(__file__))


class DevHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

    def log_message(self, format, *args):
        if args and args[0].startswith("POST /api/training/log"):
            return
        super().log_message(format, *args)

    def do_POST(self):
        if self.path == "/api/training/log":
            length = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(length).decode("utf-8", errors="replace")
            try:
                payload = json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                payload = {"message": raw}
            msg = payload.get("message", raw or "training event")
            rnd = payload.get("round")
            total = payload.get("totalRounds")
            if rnd is not None:
                print(f"[FL Train] {msg} | round {rnd}/{total}", flush=True)
            else:
                print(f"[FL Train] {msg}", flush=True)
            self.send_response(204)
            self.end_headers()
            return
        self.send_error(404)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        if self.path.startswith("/api/"):
            self.send_response(204)
            self.end_headers()
            return
        self.send_error(404)


def main():
    os.chdir(WEB_DIR)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), DevHandler)
    print(f"Serving {WEB_DIR}", flush=True)
    print(f"Open http://127.0.0.1:{PORT}/#/dashboard", flush=True)
    print("Training logs from the UI will appear below when you use dev_server.py:\n", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.", flush=True)


if __name__ == "__main__":
    main()
