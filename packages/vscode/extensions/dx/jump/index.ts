'use strict';
import * as vscode from 'vscode';
import { JUMP_EXIT, JUMP_LINE, JUMP_WORD } from '../../commands';

import {
	createCodeArray,
	createDataUriCaches,
	getCodeIndex,
	getLines,
	createTextEditorDecorationType,
	createDecorationOptions,
} from './jump';
import { JumpyPosition, JumpyFn, jumpyWord, jumpyLine } from './positions';

export function activate(context: vscode.ExtensionContext) {
	const codeArray = createCodeArray();

	// decorations, based on configuration
	const editorConfig = vscode.workspace.getConfiguration('editor');
	const configuration = vscode.workspace.getConfiguration('foretag-jump');
\
	let fontFamily = configuration.get<string>('fontFamily');
	fontFamily = fontFamily || editorConfig.get<string>('fontFamily');

	let fontSize = configuration.get<number>('fontSize');
	fontSize = fontSize || (editorConfig.get<number>('fontSize') || 16) - 1;

	const colors = {
		darkBgColor: configuration.get<string>('darkThemeBackground'),
		darkFgColor: configuration.get<string>('darkThemeForeground'),
		lightBgColor: configuration.get<string>('lightThemeBackground'),
		lightFgColor: configuration.get<string>('lightThemeForeground'),
	};

	const darkDecoration = {
		bgColor: colors.darkBgColor || '',
		fgColor: colors.darkFgColor || '',
		fontFamily: fontFamily || '',
		fontSize: fontSize || 16,
	};

	const lightDecoration = {
		bgColor: colors.lightBgColor || '',
		fgColor: colors.lightFgColor || '',
		fontFamily: fontFamily || '',
		fontSize: fontSize || 16,
	};

	createDataUriCaches(codeArray, darkDecoration, lightDecoration);

	const decorationTypeOffset2 = createTextEditorDecorationType(darkDecoration);
	const decorationTypeOffset1 = createTextEditorDecorationType(darkDecoration);

	let positions: JumpyPosition[];
	let firstLineNumber = 0;
	let isJumpyMode: boolean = false;
	setJumpyMode(false);
	let firstKeyOfCode: string | undefined;

	function setJumpyMode(value: boolean) {
		isJumpyMode = value;
		vscode.commands.executeCommand('setContext', 'foretag-jump.isJumpyMode', value);
	}

	function runJumpy(jumpyFn: JumpyFn, regexp: RegExp) {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const getLinesResult = getLines(editor);

			positions = jumpyFn(
				codeArray.length,
				getLinesResult.firstLineNumber,
				getLinesResult.lines,
				regexp,
			);

			const decorationsOffset2 = positions
				.map((position, i) => {
					if (position.charOffset === 1) {
						return createDecorationOptions(
							position.line,
							position.character,
							position.character + 2,
							context,
							codeArray[i],
						)
					}
				})
				.filter((x) => !!x);

			const decorationsOffset1 = positions
				.map((position, i) =>
					position.charOffset === 2
						? null
						: createDecorationOptions(
								position.line,
								position.character,
								position.character + 2,
								context,
								codeArray[i],
						),
				)
				.filter((x) => !!x);

			editor?.setDecorations(decorationTypeOffset2, decorationsOffset2);
			editor?.setDecorations(decorationTypeOffset1, decorationsOffset1);

			setJumpyMode(true);
			firstKeyOfCode = undefined;
		}
	}

	function exitJumpyMode() {
		const editor = vscode.window.activeTextEditor;
		setJumpyMode(false);
		editor?.setDecorations(decorationTypeOffset2, []);
		editor?.setDecorations(decorationTypeOffset1, []);
	}

	const jumpyWordDisposable = vscode.commands.registerCommand(JUMP_WORD, () => {
		const configuration = vscode.workspace.getConfiguration('foretag-jump');
		const defaultRegexp = '\\w{2,}';
		const wordRegexp = configuration
			? configuration.get<string>('wordRegexp', defaultRegexp)
			: defaultRegexp;
		runJumpy(jumpyWord, new RegExp(wordRegexp, 'g'));
	});

	context.subscriptions.push(jumpyWordDisposable);

	const jumpyLineDisposable = vscode.commands.registerCommand(JUMP_LINE, () => {
		const configuration = vscode.workspace.getConfiguration('foretag-jump');
		const defaultRegexp = '^\\s*$';
		const lineRegexp = configuration
			? configuration.get<string>('lineRegexp', defaultRegexp)
			: defaultRegexp;
		runJumpy(jumpyLine, new RegExp(lineRegexp));
	});

	context.subscriptions.push(jumpyLineDisposable);

	const jumpyTypeDisposable = vscode.commands.registerCommand(
		'type',
		(args) => {
			if (!isJumpyMode) {
				vscode.commands.executeCommand('default:type', args);
				return;
			}

			const editor = vscode.window.activeTextEditor;
			const text: string = args.text;

			if (text.search(/[a-z]/i) === -1) {
				exitJumpyMode();
				return;
			}

			if (!firstKeyOfCode) {
				firstKeyOfCode = text;
				return;
			}

			const code = firstKeyOfCode + text;
			const position = positions[getCodeIndex(code.toLowerCase())];

			editor?.setDecorations(decorationTypeOffset2, []);
			editor?.setDecorations(decorationTypeOffset1, []);

			if (vscode.window.activeTextEditor) {
				vscode.window.activeTextEditor.selection = new vscode.Selection(
					position.line,
					position.character,
					position.line,
					position.character,
				);

				const reviewType: vscode.TextEditorRevealType =
					vscode.TextEditorRevealType.Default;

				vscode.window.activeTextEditor.revealRange(
					vscode.window.activeTextEditor.selection,
					reviewType,
				);

				setJumpyMode(false);
			}
		},
	);

	context.subscriptions.push(jumpyTypeDisposable);

	const exitJumpyModeDisposable = vscode.commands.registerCommand(
		JUMP_EXIT,
		() => {
			exitJumpyMode();
		},
	);

	context.subscriptions.push(exitJumpyModeDisposable);

	const didChangeActiveTextEditorDisposable =
		vscode.window.onDidChangeActiveTextEditor((event) => exitJumpyMode());

	context.subscriptions.push(didChangeActiveTextEditorDisposable);
}

export function deactivate() {}
