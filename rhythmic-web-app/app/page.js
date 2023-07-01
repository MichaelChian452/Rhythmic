'use client'

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

import { Button } from '@mui/material'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.centerButtons}>
        <Button href="/project" className={styles.button}>Get started with a new project</Button>
      </div>
    </main>
  )
}
