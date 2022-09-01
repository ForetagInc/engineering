import {
	CancellationToken,
	CodeLens,
	CodeLensProvider,
	TextDocument,
	TextEditor,
} from 'vscode';

import { SECURITY_ENV_TOGGLE, SECURITY_ENV_PASTE, SECURITY_ENV_INSERT } from '../../commands';

export default class EnvLensProvider implements CodeLensProvider {
	activeEditor: TextEditor | undefined

	async provideCodeLenses(
		document: TextDocument,
		token: CancellationToken
	): Promise<CodeLens[]> {
		const lens: CodeLens[] = []

		let lastEnvLine = -1
		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i)

			if (line.isEmptyOrWhitespace) continue

			if (!line.text.includes('=')) continue
			lastEnvLine = i
			const toggleLens = new CodeLens(line.range, {
				command: SECURITY_ENV_TOGGLE,
				title: 'Toggle',
				arguments: [i],
			})
			const pasteLens = new CodeLens(line.range, {
				command: SECURITY_ENV_PASTE,
				title: 'Paste',
				arguments: [i],
			})
			lens.push(toggleLens)
			lens.push(pasteLens)
		}

		// It's annoying to add a new line when things are hidden so provide an easy way
		// Only want to do it on env lines because it's easy to add on other line types
		if (lastEnvLine !== -1) {
			const line = document.lineAt(lastEnvLine)
			const insertLineLens = new CodeLens(line.range, {
				command: SECURITY_ENV_INSERT,
				title: 'Insert new line',
				arguments: [lastEnvLine],
			})
			lens.push(insertLineLens)
		}

		return lens
	}

	constructor() { }

	setActiveTextEditor(editor: TextEditor | undefined) {
		this.activeEditor = editor
	}
}