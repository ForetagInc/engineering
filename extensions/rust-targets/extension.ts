import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;

function onRustTargetUpdate() {
	const config = vscode.workspace.getConfiguration();
	let val = config.get('rust-analyzer.cargo.target');
	let text = val ? val : 'system';
	statusBarItem.text = `Rust target: ${text}`;
}

export function activate(context: vscode.ExtensionContext) {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBarItem.command = 'foretag-rust.setRustTarget';
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	onRustTargetUpdate();

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((ev) => {
			if (ev.affectsConfiguration('rust-analyzer.cargo.target')) {
				onRustTargetUpdate();
			}
		}));

	let disposable = vscode.commands.registerCommand('foretag-rust.setRustTarget', () => {
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
export function deactivate() { }