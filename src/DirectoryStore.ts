import * as path from 'path';
import * as rollup from 'rollup';

export class DirectoryStore {

    private readonly store: Map<string, string>;

    public constructor() {
        this.store = new Map();
    }

    public consumeImports(
        props: {
            directory: string,
            lists: Array<Array<string>>,
            exclude: Array<string>,
        },
    ): void {
        for (const list of props.lists) {
            for (const name of list) {
                const filePath = path.join(props.directory, name);
                if (!props.exclude.includes(filePath)) {
                    this.store.set(name, path.dirname(filePath));
                }
            }
        }
    }

    public getDirectory(
        chunk: rollup.OutputChunk,
        exclude: Array<string>,
    ): string {
        if (chunk.facadeModuleId) {
            this.store.set(chunk.fileName, path.dirname(chunk.facadeModuleId));
        }
        const directory = this.store.get(chunk.fileName);
        if (!directory) {
            throw new Error(`Unresolvable: ${chunk.fileName}`);
        }
        this.consumeImports({directory, exclude, lists: [chunk.imports, chunk.dynamicImports]});
        return directory;
    }

}
