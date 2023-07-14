import { useState, useEffect, useRef } from 'react';
import OSMD from 'opensheetmusicdisplay';

import Box from '@mui/material/Box'

export default function Mistake({filePath}) {
    const sheetMusicDiv = useRef();
    const [file, setFile] = useState(filePath);

    useEffect(() => {
        const osmd = new OSMD.OpenSheetMusicDisplay(
            sheetMusicDiv.current,
            {
                followCursor: true,
                autoResize: false,
                drawTitle: false,
                drawPartNames: false,
                useXMLMeasureNumbers: false
            }
        );
        const loadFilePromise = loadFile(osmd, file);
        return () => {
            loadFilePromise.finally(() => {
                osmd.clear();
            })
        }
    }, [file]);
  
    async function loadFile(osmd, filePath) {
        const response = await fetch(`/api/assets/mistakes/${filePath.split('.')[0]}`);
        const file = await response.json();
        const xml = file.fileContent;
        console.log(filePath);
        await osmd.load(xml);
        await osmd.render();
    }
  
    return (
        <div style={{minWidth: '1000px'}} ref={sheetMusicDiv}>

        </div>
    )
  }
