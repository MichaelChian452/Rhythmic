"use client"

import { useState } from 'react';
import styles from './tstyles.module.css'
import Link from 'next/link'

export default function ProjectsTable(data) {

    const [recordings, setRecordings] = useState(data['data']);

    console.log(JSON.stringify(recordings));

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.thead}>
                        <th className={styles.th}>Project Name</th>
                        <th className={styles.th}>thumbnail</th>
                    </tr>
                </thead>
                <tbody>
                    {recordings.map((rec) => (
                        <tr>
                            <td className={styles.td}><Link href={`/project/${rec['id']}`}>{rec['projectName']}</Link></td>
                            <td className={styles.td}>sstmp</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}