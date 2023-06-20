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
        let filePath = '';
        let projectName = '';
        bb.on('file', (name, file, info) => {
            const saveTo = path.join(`${__dirname}/../../../../../testvolume/`, `${name}-${random()}`);
            console.log('File [' + name + ']: filename: ' + info.filename, saveTo);
            file.pipe(fs.createWriteStream(saveTo));
            filePath = saveTo;
        });
        bb.on('field', (fieldName, value) => {
            if(fieldName == 'sheet-music-name') {
                projectName = value;
            }
        });
        bb.on('finish', () => {
            console.log('finished');
            resolve({
                projectName, 
                filePath
            });
        });
        bb.on('error', reject);
        req.pipe(bb);
    });
}

function sendJSONToDocker(jsonObject) {
    console.log(__dirname);
    // fs.writeFile('sheet-music-pos.json', jsonObject);
    console.log('wrote to somehwere');
}

export default async function handler(req, res) {
    if (req.method == 'POST') {
        console.log('POST');
        try {
            const jsonObject = await upload(req);
            sendJSONToDocker(jsonObject);
            res.status(200).json('success');
            
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
}