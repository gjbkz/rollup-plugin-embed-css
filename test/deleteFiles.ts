import * as fs from 'fs';
import * as path from 'path';

export const deleteFiles = async (filePath: string) => {
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
        for (const name of await fs.promises.readdir(filePath)) {
            await deleteFiles(path.join(filePath, name));
        }
        await fs.promises.rmdir(filePath);
    } else {
        await fs.promises.unlink(filePath);
    }
};
