import * as VSCode from 'vscode';

import { activateSecurityEnv, deactivateSecurityEnv } from './security/env';

export function activate(context: VSCode.ExtensionContext) {
	activateSecurityEnv(context);
}

export function deactivate() {
	deactivateSecurityEnv();
}