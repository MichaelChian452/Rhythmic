import styles from '../../../page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Grading from '@/comps/Grading'
import { readFile } from 'node:fs/promises';

const path = require('node:path');

export default async function RecordingPage({ params }) {
    const projectId = params['projectid'];
    const recordingId = params['recordingid'];
    const jsonDir = path.join(process.cwd(), 'json');
    const projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
    let projKey;
    for (let key in projs) {
      if (projs[key]['id'] === projectId) {
        projKey = key;
        break;
      }
    }
    if (projKey == null) {
      throw new Error(`could not find project with id: ${projectId} in the json`);
    }

    console.log('matching project: ' + projKey);
    let recKey;
    for (let key in projs[projKey]['recordings']) {
      if (projs[projKey]['recordings'][key]['id'] === recordingId) {
        recKey = key;
        break;
      }
    }
    if (recKey == null) {
      throw new Error(`could not find recording with id: ${recordingId} in the project with id: ${projectId}`);
    }
    console.log('matching recording: ' + recKey);
    
    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Project: { projs[projKey]['projectName'] } </h1>
        <h1 className={styles.titleTag}>Your Recording ID: { recordingId } </h1>

        <div>
            Summary: you messed up!
        </div>
        <div>
          Detailed overview:
          <Grading data={projs[projKey]['recordings'][recKey]['grade']} />
        </div>
        <Link href="/">Return to Home</Link>
      </main>
    )
}