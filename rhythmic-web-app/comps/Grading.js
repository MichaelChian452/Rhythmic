"use client"

import { useState } from 'react';

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
        console.log('delete: ' + JSON.stringify(error['delete'][0]));
        for (let i in error['delete']) {
            console.log(i);
            for (let j in error['delete'][i]['notes']) {
                s += JSON.stringify(error['delete'][i]['notes'][j]['note']) + ' ' + error['delete'][i]['notes'][j]['duration'] + ' ';
            }
            console.log(s);
        }
        return (
            <div>
                {s}
            </div>
        );
    }
    else {
        return;
    }
}

function getInsertNotes(error) {
    if (error.hasOwnProperty('insert')) {
        let s = '';
        for (let i in error['insert']) {
            for (let j in error['insert'][i]['notes']) {
                s += JSON.stringify(error['insert'][i]['notes'][j]['note']) + ' ' + error['insert'][i]['notes'][j]['duration'] + ' ';
            }
        }
        return (
            <div>
                {s}
            </div>
        );
    }
    else {
        return;
    }
}


export default function RecordingsTable(data) {

    const [errors, setErrors] = useState(data['data']);

    return (
        <div className="grade-container">
            {errors.map((error) => (
                <div>
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