// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const open = require('opn');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('URL Opener is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let urlDisposable = vscode.commands.registerCommand(
    'url-opener.openAnUrl',
    openAnUrl
  );
  let selectedDisposable = vscode.commands.registerCommand(
    'url-opener.openAnSelectedUrl',
    openAnSelectedUrl
  );

  context.subscriptions.push(urlDisposable);
  context.subscriptions.push(selectedDisposable);
}

function openAnUrl() {
  const placeHolder = 'Type an url';
  const input = vscode.window.showInputBox({ placeHolder });
  input.then((url) => {
    if (url === undefined) {
      return;
    }

    if (url === '') {
      vscode.window.showInformationMessage('You need to type an url!');
      return;
    }

    openDefaultBrowser(url);
  });
}

function openAnSelectedUrl() {
  console.log('your selected url is ');
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showInformationMessage('You need to have a file opened!');
    return;
  }
  const selection = activeEditor.selection;
  const text = activeEditor.document.getText(selection);

  openDefaultBrowser(text);
}

async function openDefaultBrowser(url: string) {
  let _url = url;
  if (!_url.includes('http')) {
    _url = `http://${url}`;
  }
  await open(_url);
}

// this method is called when your extension is deactivated
export function deactivate() {}
