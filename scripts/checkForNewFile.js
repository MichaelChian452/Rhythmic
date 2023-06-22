const chokidar = require('chokidar');
const path = require('node:path');
const { exec } = require('node:child_process');

function runAudiveris(event) {
    exec('ls -la', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

chokidar.watch('./data', {
    ignoreInitial: true
}).on('add', (event, chokidarpath) => {
    console.log(`file just added: ${event}, ${chokidarpath}`);
    folders = path.parse(event);
    if(folders.dir === 'data') {
        runAudiveris(event);
    }
})