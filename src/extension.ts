import * as vscode from 'vscode';
import { format } from 'sql-formatter';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.formatSQL', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}

		const document = editor.document;
		const selection = editor.selection;

		// Get selected text or current line
		const text = selection.isEmpty
			? document.lineAt(selection.start.line).text
			: document.getText(selection);

		// Regex for function calls (fetch/execute)
		const sqlRegex = /\s*(.+?)\s?=\s?(['"`]{1,3})([\s\S]*?)\2/;

		let match = sqlRegex.exec(text);

		if (!match || match.length < 4) {
			vscode.window.showErrorMessage('No valid SQL string found in the selected text or current line.');
			return;
		}

		const variableName = match[1] || ''; // Capture the variable name if present
		const sqlString = match[3]; // Extract the SQL string
		const quoteType = match[2]; // Capture the original quote type

		const languages = ['postgresql', 'sqlite'];
		let formattedSQL = '';
		let success = false;
		let err: any;

		for (const language of languages) {
			try {
				formattedSQL = format(sqlString, { language: language as 'postgresql' | 'sqlite' });
				success = true;
				break;
			}
			catch (e: any) {
				err = e;
			}
		}

		if (!success) {
			vscode.window.showErrorMessage('Failed to format SQL: ' + err.message);
			return;
		}

		// Calculate base indentation for the variable assignment
		const baseIndentMatch = text.match(/^\s*/);
		const baseIndent = baseIndentMatch ? baseIndentMatch[0] : '';

		// Calculate relative indentation for the SQL body
		const numSpacesBeforeVariable = baseIndent.length;
		const numSpacesBeforeQuotes = numSpacesBeforeVariable + variableName.length + 3;
		const numSpacesBeforeSQL = numSpacesBeforeQuotes + 3;

		const sqlIndent = ' '.repeat(numSpacesBeforeSQL);

		// Indent all lines of the SQL string
		const indentedSQL = formattedSQL
			.split('\n')
			.map((line, index) => (index === 0 ? line : sqlIndent + line))
			.join('\n');


		// Wrap the SQL with triple quotes and align closing quotes with the opening line
		const newSQLString = `${variableName} = """${indentedSQL}\n${" ".repeat(numSpacesBeforeQuotes)}"""`;

		// Escape special characters in the SQL string for the regex
		function escapeRegExp(string: string): string {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape all special characters
		}

		// Replace the matched text with the new triple-quoted and indented SQL
		const updatedText = text.replace(
			new RegExp(`${variableName}\\s*=\\s*${quoteType}${escapeRegExp(sqlString)}${quoteType}`, 's'),
			newSQLString
		);

		editor.edit(editBuilder => {
			if (selection.isEmpty) {
				// Replace the whole line
				const range = document.lineAt(selection.start.line).range;
				editBuilder.replace(range, updatedText);
			} else {
				// Replace the selected text
				editBuilder.replace(selection, updatedText);
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
