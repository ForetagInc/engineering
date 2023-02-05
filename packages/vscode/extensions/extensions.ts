import * as vscode from 'vscode';

import {
	activate as activateJump,
	deactivate as deactivateJump,
} from './dx/jump';

import {
	activate as activateFileSize,
	deactivate as deactivateFileSize,
} from './file';

export function activate(context: vscode.ExtensionContext) {
	activateJump(context);
	activateFileSize(context);
}

export function deactivate() {
	deactivateJump();
	deactivateFileSize();
}
