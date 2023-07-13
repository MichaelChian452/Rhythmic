import styles from '../../../../page.module.css'
import Link from 'next/link'
import Grading from '@/comps/Grading'

import { getRecordingById } from '@/lib/utils';
export default async function RecordingPage({ params }) {
    const startTime = Date.now();
    const { projectName, recording } = await getRecordingById(params.projectid, params.recordingid);
    console.log('getRecordingById() took: ', Date.now() - startTime, ' milliseconds to complete');

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Project: { projectName } </h1>
        <h1 className={styles.titleTag}>Your Recording ID: { recording.id } </h1>

        <div>
            Summary: you messed up!
        </div>
        <div>
          Detailed overview:
          <Grading data={recording.grade} />
        </div>
        <Link href="/">Return to Home</Link>
      </main>
    )
}