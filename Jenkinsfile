pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t devops-webapp .'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 8080:80 --name webapp devops-webapp'
            }
        }
    }
}
