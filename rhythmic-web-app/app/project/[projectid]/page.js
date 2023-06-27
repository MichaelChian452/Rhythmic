import styles from '../../page.module.css'
import Link from 'next/link'
import Image from 'next/image'
import RecordingsTable from '@/comps/RecordingsTable'
import { readFile } from 'node:fs/promises';

const path = require('node:path');

// export async function generateStaticParams() {
//   const posts = await fetch('https://.../project').then((res) => res.json())
 
//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

// export const getStaticPaths = async() => {
//   const jsonDir = path.join(process.cwd(), 'json');
//   const contents = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }));
//   const projs = contents['projects'];

//   const paths = projs.map(project => {
//     return {
//       params: { projectid: project.id.toString() }
//     }
//   })

//   return {
//     paths,
//     fallback: 'blocking'
//   }
// }

// export const getStaticProps = async (context) => {
//   const id = context.params.id;
//   const jsonDir = path.join(process.cwd(), 'json');
//   const projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];

//   let foundProject;
//   for(let key in projs) {
//     if(key.id === id) {
//       foundProject = projs[key];
//       break;
//     }
//   }
//   if(foundProject == null) {
//     throw new Error(`could not find project with id: ${id} in the json`);
//   }
//   console.log(foundProject);
//   return {
//     props: { 
//       project: foundProject 
//     },
//     revalidate: 10
//   }
// }

export default async function ProjectPage({ params }) {
    const id = params['projectid'];
    const jsonDir = path.join(process.cwd(), 'json');
    const projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];
    let foundProject;
    let foundKey;
    for(let key in projs) {
      if(projs[key]['id'] === id) {
        foundProject = projs[key];
        foundKey = key;
        break;
      }
    }
    if(foundProject == null) {
      throw new Error(`could not find project with id: ${id} in the json`);
    }
    console.log('matching project: ' + foundProject);

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your New Upload: { foundProject['projectName'] } </h1>
        <div>
            {/* <Image src= {sheetImg} alt="your sheet music upload."/> */}
            bruh
        </div>
        <p>Add a recording to begin comparing</p>
        <form action="/api/upload" method="post" name="recording-upload" encType="multipart/form-data">
          <div>
            <input type="hidden" name="parent-project" value={foundProject['id']} />
          </div>
          <div>
            <label htmlFor="recording">Add Recording</label>
            <input name="recording" type="file" required />
          </div>
          <button type="submit">Upload</button>
        </form>
        <div>
          Previous Recordings:
          <RecordingsTable data={projs[foundKey]['recordings']} />
        </div>
        <Link href="/">Return to Home</Link>
      </main>
    )
}