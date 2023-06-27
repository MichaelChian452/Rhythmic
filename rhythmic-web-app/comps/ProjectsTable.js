"use client"

import { useState } from 'react';

export default function ProjectsTable(data) {

    const [recordings, setRecordings] = useState(data['data']);

    console.log(JSON.stringify(recordings));

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>thumbnail</th>
                    </tr>
                </thead>
                <tbody>
                    {recordings.map((rec) => (
                        <tr>
                            <td><a href={`/project/${rec['id']}`}>{rec['projectName']}</a></td>
                            <td>sstmp</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}