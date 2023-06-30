import styles from '../../page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import RecordingsTable from '@/comps/RecordingsTable'
import { readFile } from 'node:fs/promises';

const path = require('node:path');

export default async function ProjectPage({ params }) {
    const id = params['projectid'];
    const jsonDir = path.join(process.cwd(), 'json');
    const projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
    let projKey;
    for (let key in projs) {
      if (projs[key]['id'] === id) {
        projKey = key;
        break;
      }
    }
    if (projKey == null) {
      throw new Error(`could not find project with id: ${id} in the json`);
    }

    console.log('matching project: ' + projKey);

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Project: { projs[projKey]['projectName'] } </h1>
        <div>
            {/* <Image src= {sheetImg} alt="your sheet music upload."/> */}
            bruh
        </div>
        <p>Add a recording to begin comparing</p>
        <form action="/api/upload" method="post" name="recording-upload" encType="multipart/form-data">
          <div>
            <input type="hidden" name="parent-project" value={projs[projKey]['id']} />
          </div>
          <div>
            <label htmlFor="recording">Add Recording</label>
            <input name="recording" type="file" required />
          </div>
          <button type="submit">Upload</button>
        </form>
        <div>
          Previous Recordings:
          <RecordingsTable data={projs[projKey]['recordings']} />
        </div>
        <Link href="/">Return to Home</Link>
      </main>
    )
}