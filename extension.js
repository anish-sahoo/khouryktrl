// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const button1 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  button1.text = "Run ktlint once";
  button1.tooltip = "Run ktlint once";
  button1.command = "khouryktrl.lint";
  button1.color = new vscode.ThemeColor("#FF0000");
  button1.show();

  const button2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
  button2.text = "Run Kotlin Script";
  button2.tooltip = "Run .kts Script";
  button2.command = "khouryktrl.run";
  button1.color = new vscode.ThemeColor("#00FF00");
  button2.show();

  context.subscriptions.push(button1);
  context.subscriptions.push(button2);

	const filePattern = '**/*.{kt,kts}';
  const watcher = vscode.workspace.createFileSystemWatcher(filePattern);

  // Handle file changes (enable/disable buttons)
  watcher.onDidChange(() => {
      updateButtonsVisibility(button1, button2, vscode.workspace);
  });
  watcher.onDidCreate(() => {
      updateButtonsVisibility(button1, button2, vscode.workspace);
  });
  watcher.onDidDelete(() => {
      updateButtonsVisibility(button1, button2, vscode.workspace);
  });

  context.subscriptions.push(watcher);

  // Call updateButtonsVisibility initially to check for existing files
  updateButtonsVisibility(button1, button2, vscode.workspace);

  // Rest of your code (registering commands, etc.)


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "khouryktrl" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let runKTS = vscode.commands.registerCommand('khouryktrl.run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const filePath = activeEditor.document.fileName;
			vscode.window.showInformationMessage(`Running KTS Script: ${filePath}`);
			const terminal = vscode.window.createTerminal('Running Kotlin File');
			terminal.sendText(`kotlin -cp khoury.jar "${filePath}"`);
			terminal.show();
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	});
	
	//code to run ktlint
	let runLint = vscode.commands.registerCommand('khouryktrl.lint', function () {
		vscode.window.showInformationMessage('Running KTS Lint');
		const terminal = vscode.window.createTerminal('KTS Lint Terminal');
		terminal.sendText('ktlint --format');
		terminal.show();
	});
	
	context.subscriptions.push(runKTS);
	context.subscriptions.push(runLint);
}

// This method is called when your extension is deactivated
function deactivate() {
	console.log(":(, extension deactivated");
}

function updateButtonsVisibility(button1, button2, folder) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return;
  }

  const hasKotlinFilesPromise = vscode.workspace.findFiles('**/*.{kt,kts}', folder.uri);
  hasKotlinFilesPromise.then((ktFiles) => {
    const hasKotlinFiles = ktFiles.length > 0;
    button1.visible = hasKotlinFiles;
    button2.visible = hasKotlinFiles;
  });
}

module.exports = {
	activate,
	deactivate
}
