FROM gradle:7.3.1-jdk17
COPY /audiveris .
RUN git config --global --add safe.directory /home/gradle && git rev-parse --short HEAD && ./gradlew --stacktrace build
# CMD ./gradlew run
CMD tail -f /dev/null