FROM --platform=linux/amd64 ubuntu:latest
RUN apt-get update && apt-get install -y build-essential libsndfile-dev libasound2-dev
WORKDIR /mscore
COPY ./builds ./builds
RUN tar xzf ./builds/Qt-6.5.1.tar.gz -C /usr/local
RUN mkdir /usr/local/mscore && tar xzf ./builds/mscore.tar.gz -C /usr/local/mscore
RUN tar xzf ./builds/libsslcrypto1.1.tar.gz -C /usr/local/lib && ldconfig /usr/local/lib
ENV PATH=/usr/local/Qt-6.5.1/bin:/usr/local/mscore/Linux-Qtlocal-Qt-6.5.1-Make-Release/install/bin:$PATH
ENV QT_QPA_PLATFORM=offscreen

RUN apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
CMD node /rhythmic/scripts/checkForNewMidi.js