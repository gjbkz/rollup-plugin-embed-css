import * as fs from 'fs';
import * as path from 'path';

const isError = (input: unknown): input is {code: string} => {
    if (typeof input === 'object' && input) {
        return typeof (input as Record<string, unknown>).code === 'string';
    }
    return false;
};

export const deleteFiles = async (filePath: string) => {
    const stats = await fs.promises.stat(filePath).catch((error: unknown) => {
        if (isError(error) && error.code === 'ENOENT') {
            return null;
        }
        throw error;
    });
    if (!stats) {
        return;
    }
    if (stats.isDirectory()) {
        for (const name of await fs.promises.readdir(filePath)) {
            await deleteFiles(path.join(filePath, name));
        }
        await fs.promises.rmdir(filePath);
    } else {
        await fs.promises.unlink(filePath);
    }
};
