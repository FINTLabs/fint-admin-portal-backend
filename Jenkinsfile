#!groovy

node {
  currentBuild.result = "SUCCESS"

  properties([parameters([string(defaultValue: 'default', description: 'If this is set to other than `default`, it will trigger a force npm install of the fint-shared-components module.', name: 'RUN_TYPE')])])

  env.DOCKER_PORT      = (env.BRANCH_NAME == 'master') ? 8094 : 10094;
  env.DOCKER_CONTAINER = (env.BRANCH_NAME == 'master') ? "fint-admin-portal" : "fint-admin-portal_${env.BRANCH_NAME}"
  sh "echo Building branch: ${env.BRANCH_NAME} to ${env.DOCKER_CONTAINER}:${env.DOCKER_PORT}"

  try {
    stage('checkout') {
      checkout scm
    }

    stage('build') {
      if (env.RUN_TYPE != 'default') {
        sh 'cd fint-admin-portal-frontend && npm i github:fintprosjektet/fint-shared-components -S'
      }
      sh './gradlew'
    }

    stage('deploy') {
//      sh 'chmod +x docker-build'
//      sh 'sudo -E sh ./docker-build'
    }
  }

  catch (err) {
    currentBuild.result = "FAILURE"
    throw err
  }
}
