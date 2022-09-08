import * as VSCode from 'vscode';

import { activateRustTargets, deactivateRustTargets } from './targets';
import { activateCrates, deactivateCrates } from './crates';

export function activate(context: VSCode.ExtensionContext) {
	activateRustTargets(context);
	activateCrates(context);
}

export function deactivate() {
	deactivateRustTargets();
	deactivateCrates();
}