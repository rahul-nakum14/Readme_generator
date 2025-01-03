    
# from flask import Flask, request, jsonify
# import os
# import requests
# import shutil
# from pathlib import Path
# from collections import defaultdict

# # Groq API credentials
# GROQ_API_KEY = "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"  # Replace with your Groq API key
# GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# # Supported extensions for programming languages
# SUPPORTED_EXTENSIONS = {
#     ".go": "Go",
#     ".py": "Python",
#     ".js": "JavaScript",
#     ".ts": "TypeScript",
#     ".java": "Java",
#     ".rb": "Ruby",
#     ".php": "PHP",
#     ".cs": "C#",
#     ".cpp": "C++",
#     ".c": "C",
#     ".html": "HTML",
#     ".css": "CSS",
#     ".sh": "Shell",
# }

# app = Flask(__name__)

# def clone_repository(repo_url, dest_path):
#     """Clone the GitHub repository to the destination path."""
#     if os.system(f"git clone {repo_url} {dest_path}") != 0:
#         raise Exception(f"Failed to clone repository: {repo_url}")


# def analyze_repository(repo_path):
#     """Analyze the repository by identifying files in different programming languages."""
#     analysis = defaultdict(list)
#     for root, _, files in os.walk(repo_path):
#         for file in files:
#             ext = os.path.splitext(file)[1]
#             if ext in SUPPORTED_EXTENSIONS:
#                 language = SUPPORTED_EXTENSIONS[ext]
#                 with open(os.path.join(root, file), "r", errors="ignore") as f:
#                     content = f.read()
#                 analysis[language].append(f"File: {file}\n{content[:500]}...\n")  # Limit to 500 characters for brevity

#     if not analysis:
#         return "No supported programming language files found in the repository."

#     analysis_summary = ""
#     for language, files_content in analysis.items():
#         analysis_summary += f"### {language} Files\n"
#         analysis_summary += "\n".join(files_content) + "\n"

#     return analysis_summary


# def generate_readme(analysis):
#     """Generate a README file using the Groq API."""
#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "model": "llama-3.3-70b-versatile",
#         "messages": [
#             {
#                 "role": "user",
#                 "content": f"Generate a detailed README file for the following project:\n{analysis}",
#             }
#         ],
#     }

#     response = requests.post(GROQ_API_URL, headers=headers, json=payload)
#     response.raise_for_status()

#     result = response.json()
#     if "choices" in result and len(result["choices"]) > 0:
#         return result["choices"][0]["message"]["content"]
#     else:
#         raise Exception("No content returned from Groq API")


# @app.route('/')
# def index():
#     return open("index.html").read()  # Return the HTML form

# @app.route('/generate_readme', methods=['POST'])
# def generate_readme_route():
#     data = request.get_json()
#     repo_url = data.get("repoUrl")

#     if not repo_url:
#         return jsonify({"error": "No repository URL provided"}), 400

#     repo_path = Path("./repo")
#     output_dir = Path("./test")
#     output_dir.mkdir(parents=True, exist_ok=True)

#     try:
#         print("Cloning repository...")
#         clone_repository(repo_url, repo_path)

#         print("Analyzing repository...")
#         analysis = analyze_repository(repo_path)

#         print("Generating README...")
#         readme_content = generate_readme(analysis)

#         output_file = output_dir / "README.md"
#         with open(output_file, "w") as f:
#             f.write(readme_content)

#         return jsonify({"readmeContent": readme_content})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         # Clean up cloned repository
#         if repo_path.exists():
#             shutil.rmtree(repo_path)

# if __name__ == "__main__":
#     app.run(debug=True)

# # import os
# # import requests
# # import json
# # import shutil
# # from pathlib import Path
# # from collections import defaultdict

# # GROQ_API_KEY = "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"  # Replace with your Groq API key
# # GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# # SUPPORTED_EXTENSIONS = {
# #     ".go": "Go",
# #     ".py": "Python",
# #     ".js": "JavaScript",
# #     ".ts": "TypeScript",
# #     ".java": "Java",
# #     ".rb": "Ruby",
# #     ".php": "PHP",
# #     ".cs": "C#",
# #     ".cpp": "C++",
# #     ".c": "C",
# #     ".html": "HTML",
# #     ".css": "CSS",
# #     ".sh": "Shell",
# # }

# # def clone_repository(repo_url, dest_path):
# #     """Clone the GitHub repository to the destination path."""
# #     if os.system(f"git clone {repo_url} {dest_path}") != 0:
# #         raise Exception(f"Failed to clone repository: {repo_url}")


# # def analyze_repository(repo_path):
# #     """Analyze the repository by identifying files in different programming languages."""
# #     analysis = defaultdict(list)
# #     for root, _, files in os.walk(repo_path):
# #         for file in files:
# #             ext = os.path.splitext(file)[1]
# #             if ext in SUPPORTED_EXTENSIONS:
# #                 language = SUPPORTED_EXTENSIONS[ext]
# #                 with open(os.path.join(root, file), "r", errors="ignore") as f:
# #                     content = f.read()
# #                 analysis[language].append(f"File: {file}\n{content[:500]}...\n")  # Limit to 500 characters for brevity

# #     if not analysis:
# #         return "No supported programming language files found in the repository."

# #     analysis_summary = ""
# #     for language, files_content in analysis.items():
# #         analysis_summary += f"### {language} Files\n"
# #         analysis_summary += "\n".join(files_content) + "\n"

# #     return analysis_summary


# # def generate_readme(analysis):
# #     """Generate a README file using the Groq API."""
# #     headers = {
# #         "Authorization": f"Bearer {GROQ_API_KEY}",
# #         "Content-Type": "application/json",
# #     }
# #     payload = {
# #         "model": "llama-3.3-70b-versatile",
# #         "messages": [
# #             {
# #                 "role": "user",
# #                 "content": f"Generate a detailed README file for the following project:\n{analysis}",
# #             }
# #         ],
# #     }

# #     response = requests.post(GROQ_API_URL, headers=headers, json=payload)
# #     response.raise_for_status()

# #     result = response.json()
# #     if "choices" in result and len(result["choices"]) > 0:
# #         return result["choices"][0]["message"]["content"]
# #     else:
# #         raise Exception("No content returned from Groq API")


# # def main():
# #     repo_url = input("Enter the GitHub repository URL: ").strip()
# #     repo_path = Path("./repo")
# #     output_dir = Path("./test")

# #     # Ensure output directory exists
# #     output_dir.mkdir(parents=True, exist_ok=True)

# #     try:
# #         print("Cloning repository...")
# #         clone_repository(repo_url, repo_path)

# #         print("Analyzing repository...")
# #         analysis = analyze_repository(repo_path)

# #         print("Generating README...")
# #         readme_content = generate_readme(analysis)

# #         output_file = output_dir / "README.md"
# #         with open(output_file, "w") as f:
# #             f.write(readme_content)

# #         print(f"README.md generated successfully! You can find it at: {output_file}")
# #     except Exception as e:
# #         print(f"Error: {e}")
# #     finally:
# #         # Clean up cloned repository
# #         if repo_path.exists():
# #             shutil.rmtree(repo_path)


# # if __name__ == "__main__":
# #     main()

package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const groqAPIEndpoint = "https://api.groq.com/generate"
const groqAPIToken = "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" // Replace with your token

type GroqRequest struct {
	Prompt string `json:"prompt"`
}

type GroqResponse struct {
	Text string `json:"text"`
}

func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Enter the GitHub repository URL: ")
	repoURL, err := reader.ReadString('\n')
	if err != nil {
		log.Fatalf("Error reading input: %v", err)
	}
	repoURL = strings.TrimSpace(repoURL)

	repoPath := "./repo" // Path to temporarily clone the GitHub repository
	defer os.RemoveAll(repoPath) // Cleanup after execution

	err = cloneRepo(repoURL, repoPath)
	if err != nil {
		log.Fatalf("Error cloning repository: %v", err)
	}

	analysis := analyzeRepo(repoPath)
	readmeContent, err := generateReadme(analysis)
	if err != nil {
		log.Fatalf("Error generating README: %v", err)
	}

	outputDir := "./test"
	if err := ensureDir(outputDir); err != nil {
		log.Fatalf("Error ensuring test directory: %v", err)
	}

	outputPath := filepath.Join(outputDir, "README.md")
	err = ioutil.WriteFile(outputPath, []byte(readmeContent), 0644)
	if err != nil {
		log.Fatalf("Error writing README.md: %v", err)
	}

	fmt.Printf("README.md generated successfully! You can find it at: %s\n", outputPath)
}

func cloneRepo(repoURL, destPath string) error {
	fmt.Println("Cloning repository...")
	cmd := exec.Command("git", "clone", repoURL, destPath)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("failed to clone repository: %v, output: %s", err, string(output))
	}
	return nil
}

func analyzeRepo(repoPath string) string {
	fmt.Println("Analyzing repository...")
	var details []string

	filepath.Walk(repoPath, func(path string, info os.FileInfo, err error) error {
		if strings.HasSuffix(path, ".go") {
			content, _ := ioutil.ReadFile(path)
			details = append(details, string(content)) // Simplified; parse further for endpoints.
		}
		return nil
	})

	return strings.Join(details, "\n")
}
func generateReadme(analysis string) (string, error) {
	fmt.Println("Generating README...")

	// Construct the request payload
	requestPayload := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": fmt.Sprintf("Generate a detailed README file for the following project:\n%s", analysis),
			},
		},
	}
	requestBytes, _ := json.Marshal(requestPayload)

	// Create the HTTP request
	req, _ := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(requestBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", groqAPIToken))
	req.Header.Set("Content-Type", "application/json")

	// Send the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("HTTP request failed: %v", err)
	}
	defer resp.Body.Close()

	// Read and parse the response
	respBody, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Groq API Response: %s\n", string(respBody)) // Debugging output

	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	err = json.Unmarshal(respBody, &groqResp)
	if err != nil {
		return "", fmt.Errorf("failed to parse Groq API response: %v", err)
	}

	// Check if content is available
	if len(groqResp.Choices) > 0 && groqResp.Choices[0].Message.Content != "" {
		return groqResp.Choices[0].Message.Content, nil
	}

	return "", fmt.Errorf("no content returned from Groq API")
}



func ensureDir(dirPath string) error {
	if _, err := os.Stat(dirPath); os.IsNotExist(err) {
		fmt.Println("Creating test directory...")
		return os.MkdirAll(dirPath, 0755)
	}
	return nil
}
