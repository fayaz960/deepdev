pipeline {
    agent any

    stages {
        stage('Cleanup') {
            steps {
                // Stop and remove all existing containers named "webapp"
                // Remove the previous Docker image for a fresh build
                sh '''
                docker stop webapp || true
                docker rm webapp || true
                docker rmi devops-webapp || true
                docker system prune -f --volumes || true
                '''
            }
        }

        stage('Build') {
            steps {
                // Build the Docker image
                sh 'docker build -t devops-webapp .'
            }
        }

        stage('Test') {
            steps {
                // Dummy test stage (add real tests as needed)
                sh 'echo "Running tests..."'
            }
        }

        stage('Deploy') {
            steps {
                // Deploy the container on port 8081
                sh 'docker run -d -p 8081:80 --name webapp devops-webapp'
            }
        }
    }

    post {
        always {
            // Show running containers (for debugging purposes)
            sh 'docker ps'
        }
    }
}

