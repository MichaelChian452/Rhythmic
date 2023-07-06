import styles from '../../page.module.css'
import Link from 'next/link'
import RecordingsTable from '@/comps/RecordingsTable'
import { getProjectById  } from '@/lib/utils'
import RecordingUploadForm from '@/comps/RecordingUploadForm'


export default async function ProjectPage({ params }) {

    // const ref = useRef();

    const project = await getProjectById(params.projectid);
    const { projectName, id, recordings } = project;

    console.log('project page: ', project);

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Project: { projectName } </h1>
        <div>
            {/* <Image src= {sheetImg} alt="your sheet music upload."/> */}
            bruh
        </div>
        <p>Add a recording to begin comparing</p>
        <RecordingUploadForm id={id}/>
        <div>
          Previous Recordings:
          <RecordingsTable data={recordings} />
        </div>
        <Link href="/">Return to Home</Link>
      </main>
    )
}