FROM fintlabsacr.azurecr.io/admin-portal-frontend as node

FROM gradle:6.9.1-jdk11-openj9 as java
USER root
COPY . .
COPY --from=node /src/build/ src/main/resources/public/
RUN gradle --no-daemon build

FROM gcr.io/distroless/java:11
ENV JAVA_TOOL_OPTIONS -XX:+ExitOnOutOfMemoryError
COPY --from=java /home/gradle/build/libs/fint-admin-portal*.jar /data/app.jar
CMD ["/data/app.jar"]
