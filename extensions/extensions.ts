import * as vscode from 'vscode';

import { activateRustTargets, deactivateRustTargets } from './rust-targets';
import { activateSecurityEnv, deactivateSecurityEnv } from './security/env';

export function activate(context: vscode.ExtensionContext) {
	activateSecurityEnv(context);
	activateRustTargets(context);
}

export function deactivate() {
	deactivateSecurityEnv();
	deactivateRustTargets();
}