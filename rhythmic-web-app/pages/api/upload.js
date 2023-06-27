import { cwd } from 'node:process';
import fs from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const { randomFillSync } = await import('node:crypto');
import { createWriteStream } from 'node:fs';
const path = require('node:path');

const busboy = require('busboy');

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString('hex');
})();

let isRecording = false;

function getFileExtension(mimeType) {
    if (!isRecording) {
        switch (mimeType) {
            case 'image/png':
                return '.png';
            case 'image/jpg':
                return '.jpg';
            case 'image/jpeg':
                return '.jpeg';
            default:
                throw new Error('unsupported file type.');
        }
    }
    else {
        switch (mimeType) {
            case 'audio/x-m4a':
                return '.m4a';
            default:
                throw new Error('unsupported file type.');
        }
    }
}

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
        let projectId;
        bb.on('file', (name, file, info) => {
            console.log(`file received: [${name}] current dir: ${cwd()}`);
            console.log(info);
            try {
                let saveTo;
                const fName = `${name}-${random()}${getFileExtension(info.mimeType)}`;
                if(isRecording) {
                    saveTo = path.join(`${cwd()}/../data/audio-input/${projectName}`, fName);
                }
                else {
                    saveTo = path.join(`${cwd()}/../data/sheet-music-input`, fName);
                }
                console.log('File [' + name + ']: filename: ' + info.filename, saveTo);
                file.pipe(createWriteStream(saveTo));
                filePath = saveTo;
            }
            catch(e) {
                reject(e);
            }
        });
        bb.on('field', (fieldName, value) => {
            console.log(`name of project received: ${value}`);
            if (fieldName === 'sheet-music-name') {
                isRecording = false;
                projectName = value;
                try {
                    fs.promises.mkdir(`${cwd()}/../data/sheet-music-input/${projectName}`, { recursive: true });
                    console.log('updated value of projectName and created folder for it');
                }
                catch(e) {
                    console.log(e);
                    reject(e);
                }
            }
            else if (fieldName === 'parent-project') {
                isRecording = true;
                projectId = value;
            }
        });
        bb.on('finish', () => {
            console.log('finished');
            let id;
            if (!isRecording) {
                id = writeToJSON({
                    projectName, 
                    sheetFilePath: [filePath]
                });
            }
            else {
                id = writeToJSON({
                    id: projectId,
                    recording: {
                        recordingFilePath: [filePath]
                    }
                });
            }
            resolve(id);
        });
        bb.on('error', reject);
        req.pipe(bb);
    });
}

async function writeToJSON(jsonObject) {
    console.log(`writing ${JSON.stringify(jsonObject)} to json...`);
    try {
        const jsonDir = path.join(process.cwd(), 'json');
        let contents = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }));

        if (isRecording == false) {
            jsonObject['id'] = (contents['projects'].length + 1).toString();
            jsonObject['recordings'] = [];
            contents['projects'].push(jsonObject);
    
            console.log('wrote sheet music to projects.json');
        }
        else {
            let recording = jsonObject['recording'];
            recording['report'] = '';
            for(let key in contents['projects']) {
                if (contents['projects'][key]['id'] === jsonObject['id']) {
                    recording['id'] = (contents['projects'][key]['recordings'].length + 1).toString();
                    contents['projects'][key]['recordings'].push(recording);
                    console.log('appended new recording to json');
                }
            }
        }
        await writeFile(`${jsonDir}/projects.json`, JSON.stringify(contents, false, 4));

        return jsonObject['id'];
    } catch (e) {
        console.log(e);
        return;
    }
}

export default async function handler(req, res) {
    if (req.method == 'POST') {
        console.log('POST');
        try {
            const id = await upload(req);
            // let id;
            // await (async () => {
            //     id = await writeToJSON(jsonObject);
            // })()
            console.log(`json id: ${id}`);
            // res.status(200).json('success');
            res.redirect(302, `/project/${id}`);
            
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}