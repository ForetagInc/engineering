import * as VSCode from 'vscode';

interface BunTaskDefinition extends VSCode.TaskDefinition {
	/**
	 * The task name
	 */
	task: string;

	/**
	 * The rake file containing the task
	 */
	file?: string;
}

let bunPromise: Thenable<VSCode.Task[]> | undefined = undefined;

export const bunTaskProvider = VSCode.tasks.registerTaskProvider('bun', {
	provideTasks: (_token: VSCode.CancellationToken) => {
		if (!bunPromise) {
			bunPromise = getBunTasks();
		}

		return bunPromise;
	},
	resolveTask(_task: VSCode.Task): VSCode.Task | undefined {
		const task = _task.definition.task;

		if (task) {
			const definition: BunTaskDefinition = <any>_task.definition;

			return new VSCode.Task(
				definition,
				_task.scope ?? VSCode.TaskScope.Workspace,
				definition.task,
				'bun',
				new VSCode.ShellExecution(`bun ${definition.task}`)
			);
		}

		return undefined;
	}
})