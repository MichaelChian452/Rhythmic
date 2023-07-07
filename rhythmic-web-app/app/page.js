'use client'

import styles from './page.module.css'
import { Button } from '@mui/material'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.centerButtons}>
        <Button href="/project/new" className={styles.button}>Get started with a new project</Button>
      </div>
    </main>
  )
}
