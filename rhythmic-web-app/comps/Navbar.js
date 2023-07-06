import Link from 'next/link'
import styles from './styles.module.css'

export default function Navbar() {
    return (
        <div className={styles.navbar}>
            <Link href="/" className={styles.mainNav}>
                <h1>Rhythmic</h1>
            </Link>
            <div id="other-links">
                <Link href="/project" className={styles.secondaryNav}>Projects</Link>
                <Link href="/project/new" className={styles.secondaryNav}>New</Link>
            </div>
            
        </div>
    )
}