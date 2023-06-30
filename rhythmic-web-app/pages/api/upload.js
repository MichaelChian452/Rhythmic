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
    let contents;
    const jsonDir = path.join(process.cwd(), 'json');
    console.log(jsonDir);
    try {
        contents = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }));
    }
    catch (e) {
        console.log(e);
        return;
    }

    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: req.headers });
        let filePrefix = '';
        let projectName = '';
        let projectId;
        let jsonObject = {};
        bb.on('file', (name, file, info) => {
            console.log(`file received: [${name}] current dir: ${cwd()}`);
            console.log(info);
            if (!isRecording) {
                jsonObject['projectName'] = projectName;
                jsonObject['id'] = (contents['projects'].length + 1).toString();
                jsonObject['recordings'] = [];
                filePrefix = `${jsonObject['id']}`;
        
                console.log('created new json obj for sheet music');
            }
            else {
                for(let key in contents['projects']) {
                    if (contents['projects'][key]['id'] === projectId) {
                        jsonObject['id'] = (contents['projects'][key]['recordings'].length + 1).toString();
                        filePrefix = `${projectId}-${jsonObject['id']}`;
                        projectName = contents['projects'][key]['projectName'];
                        try {
                            fs.promises.mkdir(`${cwd()}/../data/audio-input/${projectName}`, { recursive: true });
                            console.log('created folder for audio-input for project');
                        }
                        catch(e) {
                            console.log(e);
                            reject(e);
                        }

                        console.log('created new json obj for recording to save in project');
                        break;
                    }
                }
            }
            
            try {
                let saveTo;
                const fName = `${filePrefix}-${name}-${random()}${getFileExtension(info.mimeType)}`;
                if(isRecording) {
                    saveTo = path.join(`${cwd()}/../data/audio-input/${projectName}`, fName);
                    jsonObject['recordingFilePath'] = saveTo;
                }
                else {
                    saveTo = path.join(`${cwd()}/../data/sheet-music-input/${projectName}`, fName);
                    jsonObject['sheetFilePath'] = saveTo;
                }
                console.log('File [' + name + ']: filename: ' + info.filename, saveTo);
                file.pipe(createWriteStream(saveTo));
            }
            catch (e) {
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
                id = writeToJSON(jsonObject, contents);
            }
            else {
                id = writeToJSON({
                    id: projectId,
                    jsonObject
                }, contents);
            }
            resolve(id);
        });
        bb.on('error', reject);
        req.pipe(bb);
    });
}

async function writeToJSON(jsonObject, contents) {
    console.log(`writing ${JSON.stringify(jsonObject)} to json...`);
    if (isRecording == false) {
        contents['projects'].push(jsonObject);

        console.log('wrote sheet music to projects.json');
    }
    else {
        let id = jsonObject['id'];
        let recording = jsonObject['jsonObject'];
        for(let key in contents['projects']) {
            if (contents['projects'][key]['id'] === id) {
                contents['projects'][key]['recordings'].push(recording);
                console.log('wrote new recording to projects.json');
            }
        }
    }
    const jsonDir = path.join(process.cwd(), 'json');
    await writeFile(`${jsonDir}/projects.json`, JSON.stringify(contents, false, 4));

    return jsonObject['id'];
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