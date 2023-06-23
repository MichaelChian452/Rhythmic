FROM amazoncorretto:17-alpine
COPY ./builds ./builds
RUN unzip ./builds/Audiveris-5.3-beta.zip
ENV PATH=/Audiveris-5.3-beta/bin:$PATH
RUN apk add nodejs npm && apk add --no-cache msttcorefonts-installer fontconfig && update-ms-fonts
WORKDIR /rhythmic/scripts
RUN npm install chokidar
CMD node checkForNewSheetMusic.js