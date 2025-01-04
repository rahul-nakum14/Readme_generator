import requests
from flask import Flask, request
from flask_socketio import SocketIO
from threading import Thread, Lock
import google.generativeai as genai

# Configuration
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".go", ".java"]
GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GENAI_API_KEY = "AIzaSyDia290Ad4zkTdeCGKNDoGURXaaz9lXYsY"  # Replace with your Google Generative AI API key
GPT_API_URL = "https://gpt-4o-mini.deno.dev/"

# Google Generative AI configuration
genai.configure(api_key=GENAI_API_KEY)

def fetch_file_content(file_url):
    response = requests.get(file_url)
    response.raise_for_status()
    return response.text

def generate_readme_with_gpt(file_content, file_name):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "stream": False,
        "messages": [
            {"role": "system", "content": f"Create a README.md for the file {file_name} with all necessary information."},
            {"role": "user", "content": "Please generate a detailed README for my project."}
        ]
    }
    response = requests.post(GPT_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def generate_readme_with_google(file_content, file_name):
    try:
        # Generate the README using Google Generative AI (Gemini)
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(
            f"create a readme.md file for {file_name} at {file_content}. It should contain all necessary information, like all endpoint parameters, descriptions, and other necessary things."
        )
        return response.text  # Return the generated content from Google API
    except Exception as e:
        return f"Error generating README with Google: {str(e)}"

def generate_readme_with_claude(file_content, file_name):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "claude-3-haiku",
        "stream": False,
        "messages": [
            {"role": "system", "content": f"Create a README.md for the file {file_name} with all necessary information."},
            {"role": "user", "content": "Please generate a detailed README for my project."}
        ]
    }
    response = requests.post(GPT_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def generate_readme_with_llama(file_content, file_name):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "llama-3.1-70b",
        "stream": False,
        "messages": [
            {"role": "system", "content": f"Create a README.md for the file {file_name} with all necessary information."},
            {"role": "user", "content": "Please generate a detailed README for my project."}
        ]
    }
    response = requests.post(GPT_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def generate_readme_with_groq(file_content, file_name):
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
        # Ensure 'file' is a dictionary
        if isinstance(file, dict):
            ext = file.get("name", "").split(".")[-1]
            if f".{ext}" in SUPPORTED_EXTENSIONS:
                content = fetch_file_content(file.get("download_url"))
                # Attempt to generate README with GPT first
                readme = generate_readme_with_gpt(content, file["name"])
                if "Error" in readme:
                    # Fallback to Google Gemini if GPT fails
                    readme = generate_readme_with_google(content, file["name"])
                if "Error" in readme:
                    # Fallback to Claude-3 if Google Gemini fails
                    readme = generate_readme_with_claude(content, file["name"])
                if "Error" in readme:
                    # Fallback to Llama-3 if Claude-3 fails
                    readme = generate_readme_with_llama(content, file["name"])
                if "Error" in readme:
                    # Finally, fallback to Groq if all others fail
                    readme = generate_readme_with_groq(content, file["name"])

                with lock:
                    socketio.emit("readme_section", {"readme_content": readme}, room=sid)
        else:
            raise TypeError(f"Expected file to be a dictionary, got {type(file)}")

    except Exception as e:
        socketio.emit("error", {"message": f"Error processing {file.get('name', 'unknown')}: {str(e)}"}, room=sid)

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

# from flask import Flask, request
# from flask_socketio import SocketIO
# import requests
# from threading import Thread, Lock

# # Configuration
# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")
# SUPPORTED_EXTENSIONS = [".py", ".js", ".ts", ".go", ".java"]
# GROQ_API_KEY = "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"  # Replace with your Groq API key
# GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# def fetch_file_content(file_url):
#     response = requests.get(file_url)
#     response.raise_for_status()
#     return response.text

# def generate_readme(file_content, file_name):
#     headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
#     payload = {
#         "model": "llama-3.3-70b-versatile",
#         "messages": [{"role": "user", "content": f"Generate README for file {file_name}:\n{file_content}"}],
#     }
#     response = requests.post(GROQ_API_URL, headers=headers, json=payload)
#     response.raise_for_status()
#     return response.json()["choices"][0]["message"]["content"]

# def process_file(file, socketio, lock, sid):
#     try:
#         ext = file["name"].split(".")[-1]
#         if f".{ext}" in SUPPORTED_EXTENSIONS:
#             content = fetch_file_content(file["download_url"])
#             readme = generate_readme(content, file["name"])
#             with lock:
#                 socketio.emit("readme_section", {"readme_content": readme}, room=sid)
#     except Exception as e:
#         socketio.emit("error", {"message": f"Error processing {file['name']}: {str(e)}"}, room=sid)

# @socketio.on("generate_readme")
# def handle_generate_readme(data):
#     repo_url = data.get("repoUrl")
#     sid = request.sid
#     try:
#         api_url = f"https://api.github.com/repos/{'/'.join(repo_url.rstrip('/').split('/')[-2:])}/contents"
#         files = requests.get(api_url).json()
#         lock = Lock()
#         threads = [
#             Thread(target=process_file, args=(file, socketio, lock, sid)) for file in files if file["type"] == "file"
#         ]
#         for thread in threads:
#             thread.start()
#         for thread in threads:
#             thread.join()
#         socketio.emit("progress", {"status": "README generation complete!"}, room=sid)
#     except Exception as e:
#         socketio.emit("error", {"message": str(e)}, room=sid)

# if __name__ == "__main__":
#     socketio.run(app, debug=True)
