const { randomFillSync } = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const busboy = require('busboy');

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString('hex');
})();

export const config = {
    api: {
        bodyParser: false
    }
}
async function upload(req) {
    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            const saveTo = path.join(os.tmpdir(), `${name}-${random()}`);
            console.log('File [' + name + ']: filename: ' + info.filename, saveTo);
            file.pipe(fs.createWriteStream(saveTo));
        });
        bb.on('text', (name, text, info) => {

        });
        bb.on('finish', () => {
            console.log('finished');
            resolve();
        });
        bb.on('error', reject);
        req.pipe(bb);
    });
}

export default async function handler(req, res) {
    if (req.method == 'POST') {
        console.log('POST');
        try {
            await upload(req);
            res.status(200).json({ upload: 'Success' });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
}