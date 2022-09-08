import {
	Position,
	Range,
	Selection,
	TextEditor,
	TextEditorDecorationType,
	window,
} from 'vscode'

export default class Decorator {
	decorationType: TextEditorDecorationType
	textEditor: TextEditor | undefined
	decorationArray: Range[]
	isHiddenArray: boolean[]

	constructor() {
		this.decorationArray = []
		this.isHiddenArray = []
		this.decorationType = window.createTextEditorDecorationType({
			before: {
				contentText: '...',
			},
			textDecoration: 'none; display: none',
		})
	}

	setTextEditor(editor: TextEditor | undefined) {
		this.textEditor = editor
		this.hideEnvs()
	}

	hideEnvs() {
		const regex = /(.env)/
		if (!this.textEditor?.document.fileName.match(regex)) return

		const document = this.textEditor.document
		const decorationsArray: Range[] = []

		for (let i = 0; i < document.lineCount; i++) {
			const line = document.lineAt(i)
			if (line.isEmptyOrWhitespace || !line.text.includes('=')) continue
			const startIndex = line.text.indexOf('=') + 1
			if (startIndex === -1) continue
			const range = new Range(
				new Position(i, startIndex),
				new Position(i, line.range.end.character)
			)
			decorationsArray.push(range)
		}

		this.decorationArray = decorationsArray
		this.isHiddenArray = new Array(decorationsArray.length).fill(true)
		this.textEditor.setDecorations(this.decorationType, decorationsArray)
	}

	toggleIndex(index: number) {
		this.isHiddenArray[index] = !this.isHiddenArray[index]

		const filteredDecorationsArray = this.decorationArray.filter(
			(_, idx) => this.isHiddenArray[idx]
		)
		this.textEditor?.setDecorations(
			this.decorationType,
			filteredDecorationsArray
		)
	}

	async pasteIndex(index: number, content: string) {
		if (!this.textEditor) return
		const oldRange = this.decorationArray[index]
		const line = this.textEditor.document.lineAt(index)
		const variableName = line.text.slice(0, oldRange.start.character - 1)
		try {
			await this.textEditor.edit((builder) => {
				builder.replace(oldRange, content)
			})
			const message = window.setStatusBarMessage(
				`Pasted into ${variableName}`
			)
			setTimeout(() => {
				message.dispose()
			}, 5000)
		} catch (error) {
			window.showErrorMessage('Something went wrong...')
		}
		this.hideEnvs()
	}

	async insertIndex(index: number) {
		if (!this.textEditor) return
		await this.textEditor.edit((builder) => {
			const prevLine = this.textEditor?.document.lineAt(index)
			const prevLineEnd = prevLine?.range.end.character || 0
			builder.insert(new Position(index, prevLineEnd), '\n')
		})
		const position = new Position(index + 1, 0)
		this.textEditor.selection = new Selection(position, position)
	}
}