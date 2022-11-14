FROM fintlabsacr.azurecr.io/admin-portal-frontend as node

FROM gradle:7.5.1-jdk17 as java
USER root
COPY . .
COPY --from=node /src/build/ src/main/resources/public/
RUN gradle --no-daemon build

FROM gcr.io/distroless/java:17
ENV JAVA_TOOL_OPTIONS -XX:+ExitOnOutOfMemoryError
COPY --from=java /home/gradle/build/libs/fint-admin-portal*.jar /data/app.jar
CMD ["/data/app.jar"]
