import { main, titleTag } from '../../page.module.css'
import Link from 'next/link'
import RecordingsTable from '@/comps/RecordingsTable'
import { getProjectById } from '@/lib/utils'
import RecordingUploadForm from '@/comps/RecordingUploadForm'

export default async function ProjectPage({ params }) {
    const startTime = Date.now();
    const project = await getProjectById(params.projectid);
    const { projectName, id, recordings } = project;

    console.log('project page: ', project);
    console.log('getProjectById() took: ', Date.now() - startTime, ' milliseconds to complete');
    
    return (
      <main className={main}>
        <h1 className={titleTag}>Your Project: { projectName } </h1>
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