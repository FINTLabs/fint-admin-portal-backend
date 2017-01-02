# Fint Admin portal

This is a fullstack project using [angular-cli](https://cli.angular.io/) and springboot.

[![Build Status](https://jenkins.rogfk.no/buildStatus/icon?job=FINTprosjektet/fint-admin-portal/master)](https://jenkins.rogfk.no/job/FINTprosjektet/job/fint-admin-portal/job/master/)

[Admin portal](https://adminportal.felleskomponent.no/)

## How to develop

There are two ways to run this application:

1. As a docker production ready unit
```bash
./gradlew
DOCKER_CONTAINER=fint-admin-portal DOCKER_PORT=**** runParams="-Durl=*** -Duser=*** -Dpassword=***" ./docker-build
```

2. Separate frontend and backend *(two separate shells)*
```bash
./gradlew -Purl=*** -Puser=*** -Ppassword=*** fint-admin-portal-frontend:webjar fint-admin-portal-backend:runAll
```
```bash
cd fint-admin-portal-frontend
npm start
```

**NOTE!** In both cases you require environment variables for LDAP connection present (_url_, _user_, _password_).

**NOTE 2!** The angular-cli requires at least 1Gb of RAM available in order to complete the webpack build task.

**NOTE 3!** If you experience build errors from gradle, try the `--console plain` gradle switch.

