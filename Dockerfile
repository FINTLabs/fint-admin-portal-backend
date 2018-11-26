FROM fintlabs.azurecr.io/admin-portal-frontend as node

FROM gradle:4.6-jdk8-alpine as java
USER root
COPY . .
COPY --from=node /src/build/ src/main/resources/public/
RUN gradle --no-daemon build

FROM openjdk:8-jre-alpine
COPY --from=java /home/gradle/build/libs/fint-admin-portal*.jar /data/app.jar
CMD ["java", "-jar", "/data/app.jar"]
