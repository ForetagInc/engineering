import * as VSCode from 'vscode';

import { activateRustTargets, deactivateRustTargets } from './rust-targets';
import { activateSecurityEnv, deactivateSecurityEnv } from './security/env';

export function activate(context: VSCode.ExtensionContext) {
	activateSecurityEnv(context);
	activateRustTargets(context);
}

export function deactivate() {
	deactivateSecurityEnv();
	deactivateRustTargets();
}