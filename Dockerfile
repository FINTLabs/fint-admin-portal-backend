FROM node AS node
WORKDIR /src/client
COPY client .
RUN yarn install && npm rebuild node-sass && yarn build

FROM gradle:jdk8-alpine as java
USER root
COPY . .
RUN gradle -b client/build-client.gradle webjar && gradle --no-daemon build

FROM openjdk:8-jre-alpine
COPY --from=java /home/gradle/build/libs/fint-admin-portal-backend*.jar /data/app.jar
CMD ["java", "-jar", "/data/app.jar"]

