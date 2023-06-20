import styles from '../page.module.css'
import Link from 'next/link'

export default function Process() {
    return (
      <main className={styles.main}>
        <h1 className={styles.titleTag}>Start Comparing Your Music</h1>
        <form action="/api/upload" method="post" name="sheet-music-upload" encType="multipart/form-data">
          <div>
            <label htmlFor="sheet-music-name">Name of Sheet Music</label>
            <input id="sheet-music-name" name="sheet-music-name" type="text" required />
          </div>
          <div>
            <input name="sheet-music-img" type="file" accept="image/png, image/jpg" required />
          </div>
          <button type="submit">Upload</button>
        </form>
        <Link href="/">Return to Home</Link>
      </main>
    )
  }