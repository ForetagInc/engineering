import * as vscode from 'vscode';

import { RUST_SET_TARGET } from '../commands';

let statusBarItem: vscode.StatusBarItem;

const RUST_ANALYZER_TARGET = 'rust-analyzer.cargo.target';

function onRustTargetUpdate() {
	const config = vscode.workspace.getConfiguration();
	let val = config.get(RUST_ANALYZER_TARGET);
	let text = val ? val : 'system';
	statusBarItem.tooltip = 'Rust target';
	statusBarItem.text = `Target: ${text}`;
}

export function activateRustTargets(context: vscode.ExtensionContext) {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBarItem.command = RUST_SET_TARGET;
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	onRustTargetUpdate();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((ev) => {
			if (ev.affectsConfiguration(RUST_ANALYZER_TARGET)) {
				onRustTargetUpdate();
			}
		}));

	let disposable = vscode.commands.registerCommand(RUST_SET_TARGET, () => {
		const config = vscode.workspace.getConfiguration();
		const extConfig = config['rust'];
		const targets: string[] = extConfig['targets'];

		vscode.window.showQuickPick(targets).then((val) => {
			if (val != undefined) {
				const target: string | undefined = val == 'system' ? undefined : val;
				config.update('rust-analyzer.cargo.target', target, true);
			}
		});
	});

	context.subscriptions.push(disposable);
}

// TODO: implement deactivation of the target and reset to default
export function deactivateRustTargets() { }