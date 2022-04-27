import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

function onTargetUpdate() {
	const config = vscode.workspace.getConfiguration();
	let val = config.get('rust-analyzer.cargo.target');
	let text = val ? val : 'system';
	statusBarItem.text = `Rust target: ${text}`;
}

export function activate(context: vscode.ExtensionContext) {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBarItem.command = 'rust-targets.setRustTarget';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	onTargetUpdate();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((ev) => {
			if (ev.affectsConfiguration('rust.target')) {
				onTargetUpdate();
			}
		}));

	let disposable = vscode.commands.registerCommand('rust-targets.setRustTarget', () => {
		const config = vscode.workspace.getConfiguration();
		const extConfig = config['rust.targets'];
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
export function deactivate() { }