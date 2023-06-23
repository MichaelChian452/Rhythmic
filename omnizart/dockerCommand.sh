# install and set up nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# install nodejs 16 because omnizart base image only works with nodejs 16
nvm install 16
npm install -g chokidar@3
node /rhythmic/scripts/checkForNewAudio.js
