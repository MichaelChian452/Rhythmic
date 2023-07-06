import 'server-only'

import path from 'node:path'
import { readFile } from 'node:fs/promises'
import imageType from 'image-type'

const getBase64FromUrl = async (url) => {
    const data = await readFile(url);
    const b64 = data.toString('base64');
    const type = await imageType(data);
    if (type.mime === null) {
      throw new Error(`image: ${url} type could not be found.`);
    }
    return `data:${type.mime};base64,${b64}`;
};

const getJSON = async () => {
    const jsonDir = path.join(process.cwd(), 'json');
    return JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
}

export async function getProjectById(projectId) {
    const json = await getJSON();
    return json.find(({ id }) => id === projectId);
}

export async function getProjects() {
    console.log('get projects');
    const json = await getJSON();
    const projects = Promise.all(json.map(async ({ projectName, id, sheetFilePath }) => {
        return {
            projectName, 
            id,
            sheetFilePath,
            base64: await getBase64FromUrl(sheetFilePath)
        };
    }));

    return projects;
}