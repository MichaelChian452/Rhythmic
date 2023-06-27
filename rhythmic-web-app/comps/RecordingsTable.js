"use client"

import { useState } from 'react';

export default function RecordingsTable(data) {

    const [recordings, setRecordings] = useState(data['data']);

    console.log(JSON.stringify(recordings));

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Recording</th>
                        <th>Grading</th>
                    </tr>
                </thead>
                <tbody>
                    {recordings.map((rec) => (
                        <tr>
                            <td>{rec['id']}</td>
                            <td>grade substitute</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}