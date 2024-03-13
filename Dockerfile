FROM gradle:7.3-jdk17-alpine as java
USER root
COPY . .
RUN gradle --no-daemon build

FROM gcr.io/distroless/java17
ENV JAVA_TOOL_OPTIONS -XX:+ExitOnOutOfMemoryError
COPY --from=java /home/gradle/build/libs/fint-admin-portal-backend-*.jar /data/app.jar
CMD ["/data/app.jar"]
