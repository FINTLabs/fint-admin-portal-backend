FROM gradle:9.9-jdk17-alpine as java
USER root
COPY . .
RUN gradle --no-daemon build

FROM eclipse-temurin:25-jre
ENV JAVA_TOOL_OPTIONS -XX:+ExitOnOutOfMemoryError
COPY --from=java /home/gradle/build/libs/fint-admin-portal-backend-*.jar /data/app.jar
ENTRYPOINT ["java", "-jar", "/data/app.jar"]
