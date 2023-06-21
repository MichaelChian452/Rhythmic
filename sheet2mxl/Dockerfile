FROM gradle:7.3.1-jdk17
COPY ./audiveris .
RUN git config --global --add safe.directory /home/gradle && git rev-parse --short HEAD && ./gradlew --stacktrace build
RUN unzip /home/gradle/build/distributions/Audiveris-5.3-beta.zip
ENV PATH=/home/gradle/Audiveris-5.3-beta/bin:/home/gradle/build/distributions/Audiveris-5.3-beta/bin:$PATH
CMD tail -f /dev/null