'use client'

import { useState, useRef } from "react";

import { Button, IconButton, InputLabel, Unstable_Grid2 as Grid } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material';

export default function RecordingUploadForm({ id }) {
    const [previewFileName, setPreviewFileName] = useState(null);
    const ref = useRef();

    const handleFileUpload = (event) => {
        // when the uploaded file is chosen,
        // convert it to a data URL, and set it as the value of the preview image
        const file = event.target.files[0];
        setPreviewFileName(file.name);

    };

    console.log('recordinguploadform: ', id);
    return (
        <form action="/api/upload" method="post" name="recording-upload" encType="multipart/form-data">
            <input type="hidden" name="parent-project" value={id} />
            <Grid container spacing={1}>
                <Grid xs={4}>
                    <InputLabel htmlFor="recording">Add Recording</InputLabel>
                </Grid>
                <Grid xs={8}>
                    {previewFileName}
                    <IconButton color="primary" aria-label="upload recording" 
                        onClick={(e) => ref.current?.click()}
                        variant="contained" component="span">
                        <AddIcon />
                    </IconButton>
                    <input name="recording" type="file" style={{display: 'none'}} onChange={handleFileUpload} ref={ref} required />
                </Grid>
                <Grid xs={4}>
                    <Button variant="contained" type="submit">
                        Add Recording
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}