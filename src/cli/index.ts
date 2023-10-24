import { readdir } from 'fs/promises';
import path from 'path';
import { set, startCase } from 'lodash-es';
import { select } from '@inquirer/prompts';

type CommandFn = () => Promise<void>;

type Recursive<T> = Record<string, T> | T;

type RecursiveCommand = Recursive<CommandFn>;

async function runCommand(mappingOrCommand: RecursiveCommand, message: string) {
    if (typeof mappingOrCommand === 'function') {
        await mappingOrCommand();
    } else {
        const keys = Object.keys(mappingOrCommand);

        const choice = await select({
            message,
            choices: keys.map((key) => ({ name: `${startCase(key)}`, value: key })),
        });

        await runCommand(mappingOrCommand[choice], `Pick a subcommand for ${startCase(choice)}:`);
    }
}

async function main() {
    const paths = await readdir(path.resolve(__dirname, 'commands'));

    const commands: RecursiveCommand = {};
    paths
        .map((_path) => path.basename(_path, '.ts'))
        .forEach((command) => {
            const fn = async () => {
                const url = new URL(path.join('commands', command), import.meta.url);
                const { default: main } = await import(url.toString());
                await main();
            };

            set(commands, command, fn);
        });

    while (true) {
        await runCommand(commands, 'Pick a command:');
    }
}

main().catch((e) => console.error(e));
