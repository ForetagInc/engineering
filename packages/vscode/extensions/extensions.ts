import * as VSCode from 'vscode';

import { 
	activate as activateJump,
	deactivate as deactivateJump
} from './dx/jump';

export function activate(context: VSCode.ExtensionContext) {
	activateJump(context);
}

export function deactivate() {
	deactivateJump();
}