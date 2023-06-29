const chokidar = require('chokidar');
const path = require('node:path');
const { exec } = require('node:child_process');

function runAudiveris(event) {
    console.log(`running audiveris for: ${event}`);
    exec(`Audiveris -batch -output /rhythmic/data/audiveris-output -export -print ${event}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log('audiveris successfully ran');
    });
}

console.log('audiveris script: now checking /data/sheet-music-input for updates...');
chokidar.watch('/rhythmic/data/sheet-music-input', {
    ignoreInitial: true,
    usePolling: true
}).on('add', (event, chokidarpath) => {
    console.log(`audiveris input file (sheet music) just added: ${event}, ${{chokidarpath}}`);
    folders = path.parse(event);
    console.log(folders.dir);
    runAudiveris(event);
})