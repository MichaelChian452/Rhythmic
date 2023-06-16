import styles from '../page.module.css'
import Link from 'next/link'

export default function Home() {
    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Start Comparing Your Music</h1>
        <form action="/api/upload" method="post" name="sheet-music-upload" encType="multipart/form-data">
          <input type="file" accept="image/png, image/jpg" required />
          <button type="submit">Upload</button>
        </form>
        <Link href="/">Return to Home</Link>
      </main>
    )
  }