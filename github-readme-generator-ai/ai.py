import os
from dotenv import load_dotenv
import requests
from flask import Flask, request
from flask_socketio import SocketIO
from threading import Thread, Lock
import google.generativeai as genai
from flask_cors import CORS
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

# Load environment variables
load_dotenv()

# Configuration
app = Flask(__name__)
CORS(app)  # Enable CORS for Flask
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS for SocketIO

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
GPT_API_URL = os.getenv("GPT_API_URL")

# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL")

# Google Generative AI configuration
genai.configure(api_key=GENAI_API_KEY)

def fetch_file_content(file_url):
    response = requests.get(file_url)
    response.raise_for_status()
    return response.text

def generate_readme(file_content, file_name, model, user_requirements):
    base_prompt = f"Create a README.md file for the file {file_name}:\n{file_content}. It should contain all necessary information like endpoint parameters, descriptions, etc."
    if user_requirements:
        base_prompt += f"Consider the following user requirements: {user_requirements}. "
    base_prompt += "Do not include ```markdown anywhere, just provide direct .md format data."

    print('this  is the final promyp',base_prompt)
    if model == "gpt":
        return generate_readme_with_gpt(base_prompt)
    elif model == "google":
        return generate_readme_with_google(base_prompt)
    elif model == "claude":
        return generate_readme_with_claude(base_prompt)
    elif model == "llama":
        return generate_readme_with_llama(base_prompt)
    elif model == "groq":
        return generate_readme_with_groq(base_prompt)
    else:
        raise ValueError(f"Unsupported model: {model}")

def generate_readme_with_gpt(prompt):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gpt-4o-mini",
        "stream": False,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."}
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
        print(f"Error with GPT API: {e}")
        return None

def generate_readme_with_google(prompt):
    try:
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error with Google API: {e}")
        return None

def generate_readme_with_claude(prompt):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "claude-3-haiku",
        "stream": False,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."}
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

def generate_readme_with_llama(prompt):
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "llama-3.1-70b",
        "stream": False,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Hi, I am rahul, Creator of MARVIS AI and Futurewise."}
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

def generate_readme_with_groq(prompt):
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
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

def process_file(file, socketio, lock, sid, user_requirements):
    try:
        if isinstance(file, dict) and "name" in file and "download_url" in file:
            content = fetch_file_content(file["download_url"])
            repo_url = file["download_url"]  # Assuming that the URL of the file corresponds to the repo URL
            
            models = ["gpt", "google", "claude", "llama", "groq"]
            readme = None
            
            for model in models:
                readme = generate_readme(content, repo_url, model, user_requirements)
                if readme:
                    break
            
            with lock:
                socketio.emit("readme_section", {"readme_content": readme, "file_name": file["name"]}, room=sid)
        else:
            raise ValueError("Invalid file format or missing required keys ('name' and 'download_url')")

    except Exception as e:
        socketio.emit("error", {"message": f"Error processing {file.get('name', 'unknown')}: {str(e)}"}, room=sid)

@socketio.on("generate_readme")
def handle_generate_readme(data):
    repo_url = data.get("repoUrl")
    user_requirements = data.get("userRequirements", "")
    sid = request.sid
    try:
        api_url = f"https://api.github.com/repos/{'/'.join(repo_url.rstrip('/').split('/')[-2:])}/contents"
        files = requests.get(api_url).json()
        lock = Lock()
        threads = [
            Thread(target=process_file, args=(file, socketio, lock, sid, user_requirements)) for file in files if file["type"] == "file"
        ]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        socketio.emit("readme_generation_complete", room=sid)
    except Exception as e:
        socketio.emit("error", {"message": str(e)}, room=sid)

def send_email(title, description):
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"New Contact Form Submission: {title}"

        body = f"Title: {title}\n\nDescription: {description}"
        msg.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@socketio.on("send_contact_form")
def handle_send_contact_form(data):
    title = data.get("title")
    description = data.get("description")
    sid = request.sid

    if not title or not description:
        socketio.emit("contact_form_response", {"success": False, "message": "Title and description are required."}, room=sid)
        return

    success = send_email(title, description)

    if success:
        socketio.emit("contact_form_response", {"success": True, "message": "Your message has been sent successfully."}, room=sid)
    else:
        socketio.emit("contact_form_response", {"success": False, "message": "Failed to send message. Please try again later."}, room=sid)

if __name__ == "__main__":
    socketio.run(app, debug=True)

