import styles from '../page.module.css'
import ProjectsTable from '@/comps/ProjectsTable'

import { getProjects } from '../../lib/utils'

export default async function Page() {

    const projects = await getProjects();
    
    return (
        <main className={styles.main}>
            <h1 className={styles.titleTag}>Your Projects</h1>
            <ProjectsTable projects={ projects } />
        </main>
    )
  }