FROM fintlabs.azurecr.io/admin-portal-frontend as node

FROM gradle:4.10.3-jdk8-alpine as java
USER root
COPY . .
COPY --from=node /src/build/ src/main/resources/public/
RUN gradle --no-daemon build

FROM gcr.io/distroless/java
ENV JAVA_TOOL_OPTIONS -XX:+ExitOnOutOfMemoryError
COPY --from=java /home/gradle/build/libs/fint-admin-portal*.jar /data/app.jar
CMD ["/data/app.jar"]
