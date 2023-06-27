import styles from '../page.module.css'
import Link from 'next/link'
import ProjectsTable from '@/comps/ProjectsTable'
import { readFile } from 'node:fs/promises';

const path = require('node:path');

export default async function Process() {
    const jsonDir = path.join(process.cwd(), 'json');
    const projs = JSON.parse(await readFile(`${jsonDir}/projects.json`, { encoding: 'utf8' }))['projects'];

    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Your Projects</h1>
        <ProjectsTable data={projs} />
        <Link href="/">Return to Home</Link>
      </main>
    )
  }