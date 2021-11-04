import * as fs from 'fs';
import * as path from 'path';

export const deployFiles = async (
    baseDirectory: string,
    files: Record<string, Buffer | string>,
) => {
    const directories = new Set<string>();
    for (const [filePath, content] of Object.entries(files)) {
        const dest = path.join(baseDirectory, filePath);
        const directory = path.dirname(dest);
        if (!directories.has(directory)) {
            await fs.promises.mkdir(directory, {recursive: true});
            directories.add(directory);
        }
        await fs.promises.writeFile(dest, content);
    }
};
