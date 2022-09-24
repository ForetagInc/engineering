import * as vscode from 'vscode';
import { PowerShell } from 'node-powershell';

export function activateTransparency(context: vscode.ExtensionContext)
{
	if (process.platform === 'win32')
	{
		const path = context.asAbsolutePath('./Transparency.cs');

		const ps = new PowerShell({
			executableOptions: {
				"-ExecutionPolicy": 'RemoteSigned',
				"-NoProfile": true
			}
		});

		context.subscriptions.push(ps);

		ps.invoke('[Console]::OutputEncoding = [Text.Encoding]::UTF8');
		ps.invoke(`Add-Type -Path '${path}'`);

		const setAlpha = (alpha: number) =>
		{
			if (alpha < 1)
				alpha = 1;
			else if (alpha > 255)
				alpha = 255;

			ps.invoke(`[DevToolkit.Transprency]::SetTransparency(${process.pid}, ${alpha})`);
		}
	}
}

// this method is called when your extension is deactivated
export function deactivateTransparency() { }