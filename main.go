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

	repoPath := "./" // Path to temporarily clone the GitHub repository
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

	outputPath := filepath.Join(repoPath, "README.md")
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
	prompt := fmt.Sprintf("Generate a detailed README file for the following project:\n%s", analysis)
	requestBody := GroqRequest{Prompt: prompt}
	requestBytes, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", groqAPIEndpoint, bytes.NewBuffer(requestBytes))
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", groqAPIToken))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBody, _ := ioutil.ReadAll(resp.Body)
	var groqResp GroqResponse
	err = json.Unmarshal(respBody, &groqResp)
	if err != nil {
		return "", fmt.Errorf("failed to parse Groq API response: %v", err)
	}

	return groqResp.Text, nil
}
