SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".go", ".java",".php"]
GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GENAI_API_KEY = "AIzaSyDia290Ad4zkTdeCGKNDoGURXaaz9lXYsY"  # Replace with your Google Generative AI API key
GPT_API_URL = "https://gpt-4o-mini.deno.dev/v1/chat/completions"

from flask import Flask, request
from flask_socketio import SocketIO
import requests
from threading import Thread, Lock

# Configuration
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".go", ".java"]
GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def fetch_file_content(file_url):
    response = requests.get(file_url)
    response.raise_for_status()
    return response.text

def generate_readme(file_content, file_name):
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": f"Generate README for file {file_name}:\n{file_content}"}],
    }
    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def process_file(file, socketio, lock, sid):
    try:
        ext = file["name"].split(".")[-1]
        if f".{ext}" in SUPPORTED_EXTENSIONS:
            content = fetch_file_content(file["download_url"])
            readme = generate_readme(content, file["name"])
            with lock:
                socketio.emit("readme_section", {"readme_content": readme}, room=sid)
    except Exception as e:
        socketio.emit("error", {"message": f"Error processing {file['name']}: {str(e)}"}, room=sid)

@socketio.on("generate_readme")
def handle_generate_readme(data):
    repo_url = data.get("repoUrl")
    sid = request.sid
    try:
        api_url = f"https://api.github.com/repos/{'/'.join(repo_url.rstrip('/').split('/')[-2:])}/contents"
        files = requests.get(api_url).json()
        lock = Lock()
        threads = [
            Thread(target=process_file, args=(file, socketio, lock, sid)) for file in files if file["type"] == "file"
        ]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        socketio.emit("progress", {"status": "README generation complete!"}, room=sid)
    except Exception as e:
        socketio.emit("error", {"message": str(e)}, room=sid)


if __name__ == "__main__":
    socketio.run(app, debug=True)