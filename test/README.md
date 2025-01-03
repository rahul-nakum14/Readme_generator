README
================

Project Overview
---------------

This project is designed to interact with GitHub repositories using the PyGitHub library. The project consists of three Python files: `gituploader.py`, `pygit.py`, and `oop_1.py`. Each file serves a different purpose, and this README will guide you through the installation, usage, and functionality of the project.

### Table of Contents

1. [Installation](#installation)
2. [File Descriptions](#file-descriptions)
    * [gituploader.py](#gituploaderpy)
    * [pygit.py](#pygitpy)
    * [oop_1.py](#oop1py)
3. [Usage](#usage)
4. [Contributing](#contributing)

### Installation
---------------

To use this project, you'll need to install the PyGitHub library. You can do this by running the following command:

```bash
pip install pygithub
```

Additionally, you'll need to replace the GitHub personal access tokens in the code with your own tokens.

### File Descriptions
--------------------

#### gituploader.py

This file contains a simple script that connects to a GitHub repository using a personal access token.

*   It defines a function `get_dirname()` which is currently empty.
*   It uses the `github` library to connect to the repository "rahul-nakum14/test".

#### pygit.py

This file defines a class `github_test` that interacts with a GitHub repository.

*   The class takes a GitHub personal access token in its constructor and uses it to connect to the repository "rahul-nakum14/test".
*   The class has an attribute `fi` which is currently incomplete.

#### oop_1.py

This file uses the `argparse` library to parse command line arguments.

*   It defines two command line arguments: `--createfile` and `--uploadfile`.
*   It uses the `github` library to connect to a GitHub repository.

### Usage
-----

To use this project, you'll need to modify the code to suit your needs. Here are some general steps:

1.  Replace the GitHub personal access tokens in the code with your own tokens.
2.  Complete the `get_dirname()` function in `gituploader.py`.
3.  Complete the `fi` attribute in the `github_test` class in `pygit.py`.
4.  Use the `argparse` library to parse command line arguments in `oop_1.py`.
5.  Run the scripts using Python, for example:

```bash
python gituploader.py
python pygit.py
python oop_1.py --createfile example.txt --uploadfile example.txt
```

### Contributing
------------

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Make your changes and commit them.
3.  Create a pull request against the main branch.
4.  Wait for your changes to be reviewed and merged.

Note: Make sure to replace the GitHub personal access tokens with your own tokens before making any changes.

License
-------

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Commit Message Guidelines
------------------------

*   Use the imperative mood (e.g., "Fix bug" instead of "Fixed bug").
*   Keep the first line concise (less than 50 characters).
*   Use a blank line to separate the summary from the body.
*   Use bullet points in the body to describe changes.

Example commit message:

```
Fix bug in gituploader.py

*   Replaced personal access token with environment variable.
*   Completed get_dirname() function.
```