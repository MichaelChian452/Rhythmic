const chokidar = require('chokidar');
const path = require('node:path');
const { exec } = require('node:child_process');

function getFileExtension(event) {
    elements = path.parse(event);
    return path.basename(elements.base, path.extname(elements.base)) + '.musicxml';
}

function runMscore(event) {
    console.log(`running mscore for: ${event}`);
    const command = `mscore -o /rhythmic/data/mscore-output/${getFileExtension(event)} ${event}`;
    console.log(command);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log('musescore successfully ran');
    });
}

console.log('mscore script: now checking /data/midi-input for updates...');
chokidar.watch('/rhythmic/data/midi-input', {
    ignoreInitial: true,
    usePolling: true
}).on('add', (event, chokidarpath) => {
    console.log(`mscore midi input file just added: ${event}, ${{chokidarpath}}`);
    folders = path.parse(event);
    console.log(folders.dir);
    runMscore(event);
})