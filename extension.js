// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  vscode.window.showInformationMessage("Hi! Ensure that khoury.jar is in the same folder!");

	const button1 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
  button1.text = "Run ktlint (folder)";
  button1.tooltip = "Run ktlint";
  button1.command = "khouryktrl.lint";
  button1.show();

  const button2 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
  button2.text = "Run Kotlin Script (current file)";
  button2.tooltip = "Run .kts Script";
  button2.command = "khouryktrl.run";
  button2.show();

  const button3 = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  button3.text = "Run ktlint --format (folder)";
  button3.tooltip = "Run ktlint --format";
  button3.command = "khouryktrl.lintwf";
  button3.show();

  context.subscriptions.push(button1);
  context.subscriptions.push(button2);
  context.subscriptions.push(button3);

	const filePattern = '**/*.{kt,kts}';
  const watcher = vscode.workspace.createFileSystemWatcher(filePattern);

  // Handle file changes (enable/disable buttons)
  watcher.onDidChange(() => {
      updateButtonsVisibility(button1, button2, button3, vscode.workspace);
  });
  watcher.onDidCreate(() => {
      updateButtonsVisibility(button1, button2, button3, vscode.workspace);
  });
  watcher.onDidDelete(() => {
      updateButtonsVisibility(button1, button2, button3, vscode.workspace);
  });

  context.subscriptions.push(watcher);

  // Call updateButtonsVisibility initially to check for existing files
  updateButtonsVisibility(button1, button2, button3, vscode.workspace);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let runKTS = vscode.commands.registerCommand('khouryktrl.run', function () {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			const filePath = activeEditor.document.fileName;
			vscode.window.showInformationMessage(`Running Kotlin Script: ${filePath}`);
			const terminalName = "Run Kotlin Script";
      let terminal = vscode.window.terminals.find(t => t.name === terminalName);

      if (!terminal) {
          terminal = vscode.window.createTerminal(terminalName);
      }

      //you can change the command here to run any script of your liking
      terminal.sendText(`kotlin -cp khoury.jar "${filePath}"`);
			
      terminal.show();
		} else {
			vscode.window.showErrorMessage('No active editor found.');
		}
	});
	
	//code to run ktlint
	let runLint = vscode.commands.registerCommand('khouryktrl.lint', function () {
		vscode.window.showInformationMessage('Running ktlint on this Folder');
		const terminalName = "ktlint";
    let terminal = vscode.window.terminals.find(t => t.name === terminalName);

    if (!terminal) {
        terminal = vscode.window.createTerminal(terminalName);
    }		
    //you can change the command here to run any script of your liking
    terminal.sendText('ktlint');
		
    terminal.show();
	});

  //code to run ktlint with format
  let runLintWithFormat = vscode.commands.registerCommand('khouryktrl.lintwf', function () {
		vscode.window.showInformationMessage('Running ktlint --format on this Folder');
		const terminalName = "ktlint format";
    let terminal = vscode.window.terminals.find(t => t.name === terminalName);

    if (!terminal) {
        terminal = vscode.window.createTerminal(terminalName);
    }
		
    //you can change the command here to run any script of your liking
    terminal.sendText('ktlint --format');
		
    terminal.show();
	});
  
	context.subscriptions.push(runKTS);
	context.subscriptions.push(runLint);
  context.subscriptions.push(runLintWithFormat);
}

// This method is called when your extension is deactivated
function deactivate() {
	console.log(":(, extension deactivated");
}

function updateButtonsVisibility(button1, button2, button3, folder) {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    return;
  }

  const hasKotlinFilesPromise = vscode.workspace.findFiles('**/*.{kt,kts}', folder.uri);
  hasKotlinFilesPromise.then((ktFiles) => {
    const hasKotlinFiles = ktFiles.length > 0;
    button1.visible = hasKotlinFiles;
    button2.visible = hasKotlinFiles;
    button3.visible = hasKotlinFiles;
  });
}

module.exports = {
	activate,
	deactivate
}
