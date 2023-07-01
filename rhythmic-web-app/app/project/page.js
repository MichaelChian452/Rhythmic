'use client'

import styles from '../page.module.css'
import Link from 'next/link'

import { Button, IconButton, InputLabel, TextField, Unstable_Grid2 as Grid, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material';
import { useState, useRef } from "react";

export default function Process() {
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const ref = useRef();

    const handleFileUpload = (event) => {
        // when the uploaded file is chosen,
        // convert it to a data URL, and set it as the value of the preview image
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            setPreviewImageUrl(reader.result);
        });

        reader.readAsDataURL(file);
    };

    return (
      <main className={styles.main}>
        <Typography variant="h3" component="h1" align="left" gutterBottom>
            Create a new project
        </Typography>
        <form action="/api/upload" method="post" name="sheet-music-upload" encType="multipart/form-data">
            <Grid container spacing={1}>
                <Grid xs={4}>
                    <InputLabel htmlFor="sheet-music-name">Project Name</InputLabel>
                </Grid>
                <Grid xs={8}>
                    <TextField id="sheet-music-name" name="sheet-music-name" variant="outlined" size="small" required />
            </Grid>
            <Grid xs={4}>
                <InputLabel htmlFor="sheet-music-name">Sheet Music Images</InputLabel>
            </Grid>
            <Grid xs={8}>
                {previewImageUrl && <img src={previewImageUrl} alt="Uploaded Image" height="100" style={{'border-radius':'5px'}}/>}
                <IconButton color="primary" aria-label="upload picture"
                    onClick={(e) => ref.current?.click()}
                    variant="contained" component="span"
                    >
                      <AddIcon />
                </IconButton>
                <input name="sheet-music-img" type="file" accept="image/png, image/jpg, image/jpeg"
                    style={{display: 'none'}} onChange={handleFileUpload} required
                    ref={ref}
                    />
            </Grid>
            <Grid xs={4}>
                <Button variant="contained" type="submit">
                    Create Project
                </Button>
            </Grid>
            </Grid>
          </form>
      </main>
    )
  }