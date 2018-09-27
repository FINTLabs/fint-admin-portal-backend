FROM node AS node
WORKDIR /src/client
COPY client .
RUN yarn install && npm rebuild node-sass && yarn build

FROM gradle:4.6-jdk8-alpine as java
USER root
COPY . .
COPY --from=node /src/client/build/ src/main/resources/public/
RUN gradle --no-daemon build

FROM openjdk:8-jre-alpine
COPY --from=java /home/gradle/build/libs/fint-admin-portal-backend*.jar /data/app.jar
CMD ["java", "-jar", "/data/app.jar"]

