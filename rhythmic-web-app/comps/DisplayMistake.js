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
                autoResize: true,
                drawTitle: false
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
        await osmd.load(xml);
        await osmd.render();
    }
  
    return (
        <Box component="main">
            <div ref={sheetMusicDiv}>

            </div>
        </Box>
    )
  }
