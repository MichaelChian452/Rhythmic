import Image from 'next/image'
import styles from './page.module.css'
import StartButton from '@/comps/StartButton'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.centerButtons}>
        <StartButton />
      </div>
    </main>
  )
}
