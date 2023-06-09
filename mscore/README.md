# mscore

This folder contains the docker file and instructions for building docker container images to be able to run [mscore](https://musescore.org/en/handbook/3/command-line-options) command line.

All dependency libraries can be built with the corresponding source code for unbuntu 22.04 linux/amd64. Detailed build instructions are documented in later sections of this document.

| libraries needed | description |
| -------- | ----------- |
| Qt-6.5.1 | Build from Qt version 6.5.1 source code, by following the instructions on <https://doc.qt.io/qt-6/linux-building.html>. |
| OpenSSL | Build from openssl 1.1 source at <https://www.openssl.org/source/>. |
| mscore | Build from MuseScore's [Qt6 branch](https://github.com/musescore/MuseScore/pull/10108). Thanks to the PR author, building mscore with Qt 6.5.1 actually worked! 👏 |

Please check out the Dockerfile in this folder to find how to install other dependencies to run `mscore` command line.


## Build Qt 6 from source
Mainly follow the instructions on <https://doc.qt.io/qt-6/linux-building.html>. 

### Install build tools

```bash
# apt-get update
# apt-get install -y ninja-build cmake python3 build-essential
```

### Configure
Did not include openGL, because this project only wants to use the mscore command line.

```bash
# cd /tmp/qt-everywhere-src-6.5.1
# ./configure -no-opengl
```

### Build and Install

```bash
# cmake --build . --parallel
# cmake --install .
```

After a successful build, the built files are located in `/usr/local/Qt-6.5.1/`.

Note that the `cmake --build . --parallel` step can take a long time to finish if you are building in a docker container with limited CPU/Memory. A more powerful build environment is recommended.

### Create tar.gz for docker

See the Dockerfile for how the generated tar.gz file is being used.

```bash
# cd /usr/local/
# tar czvf Qt-6.5.1.tar.gz Qt-6.5.1
```

## Build openssl 1.1 from source

First, download openssl 1.1.1 source tar.gz file from https://www.openssl.org/source/. Then simply follow the instructions in the INTALL file extracted from the tar.gz.

```bash
# tar xzvf openssl-1.1.1u.tar.gz
# cd openssl-1.1.1u
# ./config
# make
# make test
# make install
```

The libssl and libcrypto files will be built in `/usr/local/lib`. You can use `ldconfig` to add it to the lib path:

```bash
# ldconfig /usr/local/lib
```

### Create tar.gz for docker

See the Dockerfile for how the generated tar.gz file is being used.

```bash
# cd /usr/local/lib
# tar czvf libsslcrypto1.1.tar.gz libssl* libcrypto*
```

## Build mscore from source

### Download source
Download source zip file from MuseScore's [Qt6 branch](https://github.com/musescore/MuseScore/pull/10108). Thanks to the PR author, building mscore with Qt 6.5.1 actually works!

### Build

```bash
# unzip MuseScore-qt6.zip
# cd MuseScore-qt6
# vi build/cmake/FindQt6.cmake                  ## this is to comment out OpenGL line, since the Qt we built did not include openGL.
# export PATH=/usr/local/Qt-6.5.1/bin/:$PATH    ## Add Qt executable to PATH
# cmake -P build.cmake -DCMAKE_BUILD_TYPE=Release
```

### Run mscore

```bash
# export QT_QPA_PLATFORM=offscreen
# ./builds/Linux-Qtlocal-Qt-6.5.1-Make-Release/install/bin/mscore --help
```

### Create tar.gz for docker

See the Dockerfile for how the generated tar.gz file is being used.

```bash
# cd ./builds
# tar czvf mscore.tar.gz Linux-Qtlocal-Qt-6.5.1-Make-Release
```
