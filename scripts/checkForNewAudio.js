const chokidar = require('chokidar');
const path = require('node:path');
const { exec } = require('node:child_process');

function runOmnizart(event) {
    console.log(`running omnizart for: ${event}`);
    exec(`omnizart music transcribe ${event} --output /rhythmic/data/midi-input/`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log('omnizart successfully ran and put midi file into midi-input');
    });
}

console.log('omnizart script: now checking /data/audio-input for updates...');
chokidar.watch('/rhythmic/data/audio-input', {
    ignoreInitial: true,
    usePolling: true
}).on('add', (event, chokidarpath) => {
    console.log(`omnizart input file (audio recording) just added: ${event}, ${{chokidarpath}}`);
    folders = path.parse(event);
    console.log(folders.dir);
    runOmnizart(event);
})