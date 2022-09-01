import * as vscode from 'vscode';
import Decorator from './decorator';
import Lens from './lens';

import { SECURITY_ENV_TOGGLE, SECURITY_ENV_PASTE, SECURITY_ENV_INSERT } from '../../commands';

function debounce<F extends (...args: any) => any>(func: F, delay = 300) {
	let timer: NodeJS.Timeout | undefined = undefined

	const debounced = (...args: any) => {
		clearTimeout(timer)
		timer = setTimeout(() => func(...args), delay)
	}

	return debounced as (...args: Parameters<F>) => ReturnType<F>
}

export function activateSecurityEnv(context: vscode.ExtensionContext) {
	const decorator = new Decorator()
	const envLensProvider = new Lens()

	// Set editor up for hiding on start up of a new window
	// still have some built-in lag as the extension loads in
	const startUpEditor = vscode.window.activeTextEditor
	decorator.setTextEditor(startUpEditor)

	const toggleCommandDisposable = vscode.commands.registerCommand(
		SECURITY_ENV_TOGGLE,
		(index: number) => {
			if (index === undefined) return
			decorator.toggleIndex(index)
		}
	)

	const pasteCommandDisposable = vscode.commands.registerCommand(
		SECURITY_ENV_PASTE,
		async (index: number) => {
			if (index === undefined) return
			const clipboard = await vscode.env.clipboard.readText()
			decorator.pasteIndex(index, clipboard)
		}
	)

	const insertCommandDisposable = vscode.commands.registerCommand(
		SECURITY_ENV_INSERT,
		async (index: number) => {
			if (index === undefined) return
			decorator.insertIndex(index)
		}
	)

	const codeLensProviderDisposable =
		vscode.languages.registerCodeLensProvider(
			{
				pattern: '**/.env*',
			},
			envLensProvider
		)

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		decorator.setTextEditor(editor)
	})

	// Longer delay allow for better editing experience whereas shorter
	// time allows for better hiding time on copy and paste events
	// keeping things hidden at all times seem to be more important so going
	// to keep the debounce time short
	const debouncedHideEnv = debounce(() => decorator.hideEnvs(), 200)

	vscode.window.onDidChangeTextEditorSelection((e) => {
		debouncedHideEnv()
	})

	context.subscriptions.push(toggleCommandDisposable)
	context.subscriptions.push(pasteCommandDisposable)
	context.subscriptions.push(insertCommandDisposable)
	context.subscriptions.push(codeLensProviderDisposable)
}

// this method is called when your extension is deactivated
export function deactivateSecurityEnv() { }