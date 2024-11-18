# SQL Formatter for Python

**SQL Formatter for Python** is a Visual Studio Code extension that formats SQL query strings embedded in Python code using the `sql-formatter` package. This extension supports both inline and multiline SQL queries, converting them into a standardized, readable format.

## Features

- Automatically format SQL strings in Python.
- Supports:
  - SQL strings assigned to variables.
- Converts single-quoted strings to triple-quoted strings for readability.
- Adjusts indentation to align with your Python code.
- Works seamlessly with inline and multiline SQL queries.

### Examples

#### Input:
```python
query = "SELECT id, name FROM users WHERE active = 1 ORDER BY name"
```

#### Output:
```python
query = '''SELECT
            id, name
           FROM
            users
           WHERE
            active = 1
           ORDER BY
            name
        '''
```

## Requirements

## Installation

1. Clone the repository or download the extension `.vsix` package.
2. Install the extension in VSCode:
   - Go to the Extensions view (`Ctrl+Shift+X`).
   - Click on the `...` menu and select "Install from VSIX..."
   - Choose the `.vsix` file.
3. Reload VSCode to activate the extension.

## Usage

1. Open a Python file in VSCode.
2. Highlight an SQL string or place the cursor on a line containing an SQL query.
3. Use the following methods to format the SQL:
   - **Keyboard Shortcut**: `Ctrl+Shift+F` (or `Cmd+Shift+F` on macOS).
   - **Command Palette**:
     1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS).
     2. Type `Format SQL in Python` and select the command.

## Configuration

The keyboard shortcut is active only when:
- The language mode is set to `Python`.

If you want to customize the shortcut, you can do so in the VSCode `keybindings.json` file.

## Known Issues

