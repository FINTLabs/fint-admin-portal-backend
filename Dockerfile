FROM java:8

LABEL authors="Frode Sjovatsen <frode@fintprosjektet.no>, Øystein Amundsen <oystein@fintprosjektet.no>"

ADD ./fint-admin-portal-backend/build/libs/fint-admin-portal-backend*.jar /data/app.jar

CMD ["java", "-jar", "/data/app.jar"]
