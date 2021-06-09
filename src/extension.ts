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
    'url-opener.openUrl',
    openUrl
  );
  let selectedDisposable = vscode.commands.registerCommand(
    'url-opener.openSelectedUrl',
    openSelectedUrl
  );
  let searchDisposable = vscode.commands.registerCommand(
    'url-opener.searchKeyword',
    searchKeyword
  );
  let searchSelectedDisposable = vscode.commands.registerCommand(
    'url-opener.searchSelectedKeyword',
    searchSelectedKeyword
  );

  context.subscriptions.push(urlDisposable);
  context.subscriptions.push(selectedDisposable);
  context.subscriptions.push(searchDisposable);
  context.subscriptions.push(searchSelectedDisposable);
}

function showInputBox(
  callback: (urlOrKeyword: string) => void,
  placeHolder: string
) {
  const input = vscode.window.showInputBox({ placeHolder });
  input.then((userInput) => {
    if (userInput === undefined) {
      return;
    }

    if (userInput === '') {
      vscode.window.showInformationMessage('Please type a valid one!');
      return;
    }

    callback(userInput);
  });
}

function getSelectedText() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showInformationMessage('Please have a file opened!');
    return;
  }
  const selection = activeEditor.selection;
  return activeEditor.document.getText(selection);
}

function isValidHttpUrl(url: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(url);
}

async function openDefaultBrowser(url: string) {
  const _url = url.includes('http') ? url : `http://${url}`;

  if (!isValidHttpUrl(_url)) {
    vscode.window.showInformationMessage('Please check a url!');
    return;
  }

  await open(_url);
}

const search = (keyword: string) => {
  const configSearchUrl =
    vscode.workspace.getConfiguration('url-opener').defaultSearchUrl;
  if (!configSearchUrl) return;
  const url = configSearchUrl + keyword.replace(/\s/g, '+');
  openDefaultBrowser(url);
};

function openUrl() {
  showInputBox(openDefaultBrowser, 'Type a url');
}

function openSelectedUrl() {
  const text = getSelectedText();
  if (!text) return;
  openDefaultBrowser(text);
}

function searchKeyword() {
  showInputBox(search, 'Type keywords for search');
}

function searchSelectedKeyword() {
  const text = getSelectedText();
  if (!text) return;
  search(text);
}

// this method is called when your extension is deactivated
export function deactivate() {}
