import 'server-only'

import path from 'node:path'
import { readFile } from 'node:fs/promises'
import imageType from 'image-type'

const getJSONList = async () => {
    const jsonDir = path.join(process.cwd(), 'json');
    return JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
}

export async function getProjectById(projectId) {
    const jsonList = await getJSONList();
    return jsonList.find(({ id }) => id === projectId);
}

export async function getProjects() {
    console.log('get projects');
    const jsonList = await getJSONList();
    const projects = Promise.all(jsonList.map(async ({ projectName, id, sheetFilePath, thumbnail }) => {
        return {
            projectName, 
            id,
            sheetFilePath,
            thumbnail
        };
    }));
    return projects;
}

export async function getRecordingById(projectId, recordingId) {
    console.log('get recording from project id:', projectId, 'recording id:', recordingId);
    const { projectName, recordings } = await getProjectById(projectId);
    const recording = recordings.find(({ id }) => id === recordingId);
    return {
        projectName, 
        recording
    }
}