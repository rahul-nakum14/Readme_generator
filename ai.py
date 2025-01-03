from flask import Flask, request, Response
from flask_socketio import SocketIO, emit
import requests
from meta_ai_api import MetaAI
from collections import defaultdict
from flask_cors import CORS
import os
import threading  # For threading to speed up
import time  # For simulating a delay (to track progress)

# Groq API credentials
GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Supported extensions for programming languages
SUPPORTED_EXTENSIONS = {
    ".go": "Go",
    ".py": "Python",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".java": "Java",
    ".rb": "Ruby",
    ".php": "PHP",
    ".cs": "C#",
    ".cpp": "C++",
    ".c": "C",
    ".html": "HTML",
    ".css": "CSS",
    ".sh": "Shell",
}

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

def fetch_file_content(file_url):
    """Fetch the content of a file from GitHub."""
    response = requests.get(file_url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch file content: {response.json().get('message')}")
    return response.text

def generate_readme_with_groq(file_content, file_name):
    """Generate a README for a file using the Groq API."""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "user",
                "content": f"Generate a README section for the following file ({file_name}):\n{file_content}",
            }
        ],
    }
    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()
    if "choices" in result and len(result["choices"]) > 0:
        return result["choices"][0]["message"]["content"]
    else:
        raise Exception("No content returned from Groq API")

def generate_readme_with_meta_ai(file_content, file_name):
    """Generate a README for a file using the MetaAI API."""
    ai = MetaAI()
    response = ai.prompt(
        message=f"Generate a README section for the following file ({file_name}):\n{file_content}"
    )
    return response["message"]

def get_files_from_github(repo_url):
    """Retrieve the list of files from the GitHub repository."""
    owner, repo = repo_url.rstrip("/").rsplit("/", 2)[-2:]
    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
    response = requests.get(api_url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch repository contents: {response.json().get('message')}")
    return response.json()

def process_file(file, socket, repo_url, progress_lock):
    """Process a file (fetch content, generate README, and emit progress)."""
    try:
        ext = file["name"].split(".")[-1]
        if ext in SUPPORTED_EXTENSIONS:
            file_content = fetch_file_content(file["download_url"])

            # Simulate delay for progress tracking
            time.sleep(2)  # Simulate time taken for file processing

            # Track progress
            with progress_lock:
                socket.emit("progress", {"status": f"Processing {file['name']}..."})

            try:
                readme_section = generate_readme_with_groq(file_content, file["name"])
            except Exception as groq_error:
                socket.emit("error", {"message": f"Groq API failed for {file['name']}: {groq_error}"})
                readme_section = generate_readme_with_meta_ai(file_content, file["name"])

            socket.emit("readme_section", {
                "file_name": file["name"],
                "readme_content": readme_section
            })

    except Exception as e:
        socket.emit("error", {"message": f"Error processing file {file['name']}: {str(e)}"})

@socketio.on('generate_readme')
def handle_generate_readme(data):
    repo_url = data.get("repoUrl")
    
    if not repo_url:
        emit("error", {"message": "No repository URL provided"})
        return

    try:
        files = get_files_from_github(repo_url)
        
        # Track overall progress
        progress_lock = threading.Lock()

        # Emit overall progress
        emit("progress", {"status": "Cloning repository and analyzing files..."})

        # Use threading to process files concurrently
        threads = []
        for file in files:
            if file["type"] == "file":
                thread = threading.Thread(target=process_file, args=(file, socket, repo_url, progress_lock))
                threads.append(thread)
                thread.start()

        # Wait for all threads to finish
        for thread in threads:
            thread.join()

        emit("progress", {"status": "README generation complete!"})

    except Exception as e:
        emit("error", {"message": str(e)})

if __name__ == "__main__":
    socketio.run(app, debug=True)
