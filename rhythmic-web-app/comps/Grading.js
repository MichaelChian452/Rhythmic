"use client"

import { useState } from 'react';
import Mistake from './DisplayMistake';

import styles from './styles.module.css'

function getErrorTitle(error) {
    if (error['errorType'] == 'replace') {
        return 'You played the wrong notes: ';
    }
    else if (error['errorType'] == 'insert') {
        return 'You forgot to play these notes: ';
    }
    else if (error['errorType'] == 'delete') {
        return 'You played some extra notes: ';
    }
    else {
        return 'sheesh?';
    }
}

function getDeleteNotes(error) {
    if (error.hasOwnProperty('delete')) {
        let s = '';
        console.log('err: ' + JSON.stringify(error));
        for (let i in error['delete']) {
            for (let j in error['delete'][i]['notes']) {
                s += JSON.stringify(error['delete'][i]['notes'][j]['note']) + ' ' + error['delete'][i]['notes'][j]['duration'] + ' ';
            }
        }
        return (
            <div>
                {s}
                <Mistake filePath={error['deleteMusicXML']} />
            </div>
        );
    }
    else {
        return;
    }
}

function getInsertNotes(error) {
    if (error.hasOwnProperty('insert')) {
        console.log('err: ' + JSON.stringify(error));
        let s = '';
        for (let i in error['insert']) {
            for (let j in error['insert'][i]['notes']) {
                s += JSON.stringify(error['insert'][i]['notes'][j]['note']) + ' ' + error['insert'][i]['notes'][j]['duration'] + ' ';
            }
        }
        return (
            <div className={styles.test}>
                {s}
                <Mistake filePath={error['insertMusicXML']} />
            </div>
        );
    }
    else {
        return;
    }
}

export default function MistakeTable(data) {
    const [errors, setErrors] = useState(data['data']);

    return (
        <div className="grade-container">
            {errors.map((error, index) => (
                <div key={index}>
                    {getErrorTitle(error)}
                    <div className={styles.vertFlexTable}>
                        {getDeleteNotes(error)}
                        {getInsertNotes(error)}
                    </div>
                </div>
            ))}
        </div>
    )
}