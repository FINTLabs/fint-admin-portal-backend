pipeline {
    agent none
    stages {
        stage('Build') {
            agent { label 'docker' }
            when {
                branch 'master'
            }
            steps {
                sh "docker build -t 'dtr.rogfk.no/fint-beta/admin-portal:latest ."
            }
        }
        stage('Publish') {
            agent { label 'docker' }
            when {
                branch 'master'
            }
            steps {
                withDockerRegistry([credentialsId: 'dtr-rogfk-no', url: 'https://dtr.rogfk.no']) {
                    sh "docker push 'dtr.rogfk.no/fint-beta/admin-portal:latest'"
                }
            }
        }
    }
}
