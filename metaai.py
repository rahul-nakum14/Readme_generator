import re
def extract_markdown(content):
    # Regex pattern to extract the markdown content
    markdown_pattern = r'```markdown\n#(.*?)(?=```|$)'  # Capture everything after the starting backticks and '#'
    
    # Search for the markdown content
    markdown_content = re.findall(markdown_pattern, content, re.DOTALL)
    
    # If markdown content exists, return it without the starting backticks and 'markdown' part
    if markdown_content:
        return markdown_content[0].strip()
    else:
        return None
        
# Example usage:
content = '''"content": "Sure! Below is a sample `README.md` file for your Nest.js projects repository. You can customize it further based on your specific project details and requirements.\n\n```markdown\n# Nest.js Projects\n\nWelcome to the Nest.js Projects repository! This repository contains various projects built using Nest.js, a progressive Node.js framework for building efficient and scalable server-side applications.\n\n## Table of Contents\n\n- [Installation](#installation)\n- [Usage](#usage)\n- [API Endpoints](#api-endpoints)\n  - [User Endpoints](#user-endpoints)\n  - [Product Endpoints](#product-endpoints)\n- [Contributing](#contributing)\n- [License](#license)\n\n## Installation\n\nTo get started with the projects in this repository, follow these steps:\n\n1. Clone the repository:\n   ```bash\n   git clone https://github.com/rahul-nakum14/Nest-js-Projects.git\n   ```\n\n2. Navigate to the project directory:\n   ```bash\n   cd Nest-js-Projects\n   ```\n\n3. Install the dependencies:\n   ```bash\n   npm install\n   ```\n\n4. Start the application:\n   ```bash\n   npm run start\n   ```\n\n## Usage\n\nOnce the application is running, you can access it at `http://localhost:3000`.\n\n## API Endpoints\n\n### User Endpoints\n\n#### 1. Create User\n\n- **Endpoint:** `POST /users`\n- **Description:** Create a new user.\n- **Request Body:**\n  ```json\n  {\n    \"name\": \"string\",\n    \"email\": \"string\",\n    \"password\": \"string\"\n  }\n  ```\n- **Response:**\n  - **201 Created**\n    ```json\n    {\n      \"id\": \"string\",\n      \"name\": \"string\",\n      \"email\": \"string\"\n    }\n    ```\n\n#### 2. Get User by ID\n\n- **Endpoint:** `GET /users/:id`\n- **Description:** Retrieve a user by their ID.\n- **Parameters:**\n  - `id` (string): The ID of the user.\n- **Response:**\n  - **200 OK**\n    ```json\n    {\n      \"id\": \"string\",\n      \"name\": \"string\",\n      \"email\": \"string\"\n    }\n    ```\n\n### Product Endpoints\n\n#### 1. Create Product\n\n- **Endpoint:** `POST /products`\n- **Description:** Create a new product.\n- **Request Body:**\n  ```json\n  {\n    \"name\": \"string\",\n    \"price\": \"number\",\n    \"description\": \"string\"\n  }\n  ```\n- **Response:**\n  - **201 Created**\n    ```json\n    {\n      \"id\": \"string\",\n      \"name\": \"string\",\n      \"price\": \"number\",\n      \"description\": \"string\"\n    }\n    ```\n\n#### 2. Get All Products\n\n- **Endpoint:** `GET /products`\n- **Description:** Retrieve a list of all products.\n- **Response:**\n  - **200 OK**\n    ```json\n    [\n      {\n        \"id\": \"string\",\n        \"name\": \"string\",\n        \"price\": \"number\",\n        \"description\": \"string\"\n      }\n    ]\n    ```\n\n## Contributing\n\nContributions are welcome! If you have suggestions for improvements or new features, please create an issue or submit a pull request.\n\n## License\n\nThis project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.\n\n---\n\nHi, I am Rahul, Creator of MARVIS AI and Futurewise. Thank you for checking out my Nest.js Projects repository!"'''

markdown = extract_markdown(content)
print(markdown)
