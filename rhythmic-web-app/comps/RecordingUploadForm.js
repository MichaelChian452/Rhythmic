'use client'

import { Button, IconButton, InputLabel, TextField, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material';

export default function RecordingUploadForm({ id }) {
    
    return (
        <form action="/api/upload" method="post" name="recording-upload" encType="multipart/form-data">
            <input type="hidden" name="parent-project" value={id} />
            <Grid container spacing={1}>
                <Grid xs={4}>
                    <InputLabel htmlFor="recording">Add Recording</InputLabel>
                </Grid>
                <Grid xs={8}>
                    <IconButton color="primary" aria-label="upload recording" variant="contained" component="span">
                        <AddIcon />
                    </IconButton>
                    <input name="recording" type="file" style={{display: 'none'}} required />
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