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


export async function getProjects() {
    console.log('get projects');
    const jsonDir = path.join(process.cwd(), 'json');
    const json = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
    let projects = [];
    for (let key in json) {
        let project = {};
        project['projectName'] = json[key]['projectName'];
        project['id'] = json[key]['id'];
        project['sheetFilePath'] = json[key]['sheetFilePath'];
        project['base64'] = await getBase64FromUrl(project['sheetFilePath']);
        projects.push(project);
    }
    return projects;
}