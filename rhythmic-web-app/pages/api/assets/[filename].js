const FILENAME_REGEX = /^[\w-\.]+$/;
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import mime from 'mime';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    };
    
    const { filename } = req.query;
    if (!FILENAME_REGEX.test(filename)) {
        return res.status(400).send('Bad Request');
    }

    const filePath = path.join(process.cwd(), '/../', 'data', 'assets', filename);
    try {
        const fileContent = await readFile(filePath);
        const mimeType = mime.getType(filePath);
        if (mimeType !== 'image/png' && mimeType !== 'image/jpeg' && mimeType !== 'image/jpg') {
            return res.status(400).send('Bad Request');
        }
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.send(fileContent);
    } catch (e) {
        console.log(e);
        res.status(404).send('Not Found');
    }
}