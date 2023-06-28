import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.centerButtons}>
        <Link href="/project" className={styles.button}>Get started with a new project</Link>
      </div>
    </main>
  )
}
