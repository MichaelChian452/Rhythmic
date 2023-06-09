FROM gradle:6.3-jdk14
COPY /midi2musicxml .
RUN ./gradlew shadowJar
CMD tail -f /dev/null