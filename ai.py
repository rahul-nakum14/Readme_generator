import requests
from flask import Flask, request
from flask_socketio import SocketIO
from threading import Thread, Lock
import google.generativeai as genai
from flask_cors import CORS

# Configuration
app = Flask(__name__)
CORS(app)  # Enable CORS for Flask
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS for SocketIO

GROQ_API_KEY = "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"  # Replace with your Groq API key
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GENAI_API_KEY = "AIzaSyDia290Ad4zkTdeCGKNDoGURXaaz9lXYsY"  # Replace with your Google Generative AI API key
GPT_API_URL = "https://gpt-4o-mini.deno.dev/v1/chat/completions"

# Google Generative AI configuration
genai.configure(api_key=GENAI_API_KEY)

def fetch_file_content(file_url):
    response = requests.get(file_url)
    response.raise_for_status()
    return response.text

def generate_readme_with_gpt(file_content, file_name):
    print(file_name)
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "stream": False,
        "messages": [
            {
                "role": "system",
                "content": f"Create a README.md file for the file {file_name}:\n{file_content}. It should contain all necessary information like endpoint parameters, descriptions, etc. (Do not include ```markdown at the beggining)"
            },
            {
                "role": "user",
                "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."
            }
        ]
    }
    try:
        response = requests.post(GPT_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            response_json = response.json()
            print(response_json)
            if isinstance(response_json, dict) and "choices" in response_json:
                return response_json["choices"][0]["message"]["content"]
        return None
    except Exception as e:
        print(f"Error with GPT API: {e}")
        return None

def generate_readme_with_google(file_content, file_name):
    try:
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(
            f"Create a README.md file for the file {file_name}:\n{file_content}. It should contain all necessary information like endpoint parameters, descriptions, etc."
        )
        return response.text
    except Exception as e:
        print(f"Error with Google API: {e}")
        return None

def generate_readme_with_claude(file_content, file_name):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "claude-3-haiku",
        "stream": False,
        "messages": [
            {
                "role": "system",
                "content": f"Create a README.md file for the file {file_name}:\n{file_content}. It should contain all necessary information like endpoint parameters, descriptions, etc."
            },
            {
                "role": "user",
                "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."
            }
        ]
    }
    try:
        response = requests.post(GPT_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            response_json = response.json()
            if isinstance(response_json, dict) and "choices" in response_json:
                return response_json["choices"][0]["message"]["content"]
        return None
    except Exception as e:
        print(f"Error with Claude API: {e}")
        return None

def generate_readme_with_llama(file_content, file_name):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "llama-3.1-70b",
        "stream": False,
        "messages": [
            {
                "role": "system",
                "content": f"Create a README.md file for the file {file_name}:\n{file_content}. It should contain all necessary information like endpoint parameters, descriptions, etc."
            },
            {
                "role": "user",
                "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."
            }
        ]
    }
    try:
        response = requests.post(GPT_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            response_json = response.json()
            if isinstance(response_json, dict) and "choices" in response_json:
                return response_json["choices"][0]["message"]["content"]
        return None
    except Exception as e:
        print(f"Error with Llama API: {e}")
        return None

def generate_readme_with_groq(file_content, file_name):
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": f"Generate README for file {file_name}:\n{file_content}"}],
    }
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            response_json = response.json()
            if isinstance(response_json, dict) and "choices" in response_json:
                return response_json["choices"][0]["message"]["content"]
        return None
    except Exception as e:
        print(f"Error with Groq API: {e}")
        return None

def process_file(file, socketio, lock, sid):
    try:
        if isinstance(file, dict) and "name" in file and "download_url" in file:
            content = fetch_file_content(file["download_url"])
            repo_url = file["download_url"]  # Assuming that the URL of the file corresponds to the repo URL
            
            # Try generating README with GPT first
            readme = generate_readme_with_gpt(content, repo_url)
            
            # If GPT fails, try with Google Gemini
            if not readme:
                readme = generate_readme_with_google(content, repo_url)
            
            # If Gemini fails, try with Claude
            if not readme:
                readme = generate_readme_with_claude(content, repo_url)
            
            # If Claude fails, try with Llama
            if not readme:
                readme = generate_readme_with_llama(content, repo_url)
            
            # If all API calls fail, try with Groq
            if not readme:
                readme = generate_readme_with_groq(content, repo_url)
            
            with lock:
                socketio.emit("readme_section", {"readme_content": readme}, room=sid)
        else:
            raise ValueError("Invalid file format or missing required keys ('name' and 'download_url')")

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
