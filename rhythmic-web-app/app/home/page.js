import styles from '../page.module.css'
import Link from 'next/link'
import ProjectsTable from '@/comps/ProjectsTable'
import { readFile } from 'node:fs/promises';

import imageType from 'image-type';

const path = require('node:path');

const getBase64FromUrl = async (url) => {
  const data = await readFile(url);
  const b64 = data.toString('base64');
  const type = imageType(data);
  if (type.mime === null) {
    throw new Error(`image: ${url} type could not be found.`);
  }
  return `data:${type.mime};base64,${b64}`;
};

export default async function Process() {
    const jsonDir = path.join(process.cwd(), 'json');
    let projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
    for (let key in projs) {
        projs[key]['base64'] = await getBase64FromUrl(projs[key]['sheetFilePath']);
        console.log(projs[key]['base64']);
    }

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Projects</h1>
        <ProjectsTable data={projs} />
      </main>
    )
  }