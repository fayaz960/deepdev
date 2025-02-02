pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "flappy-webapp"  // Name of the Docker image
    }

    stages {
        stage('Cleanup') {
            steps {
                sh '''
                # Stop and remove any running containers named "webapp"
                docker stop webapp || true
                docker rm webapp || true

                # Remove the previous Docker image if it exists
                docker rmi $DOCKER_IMAGE || true

                # Clean up any dangling Docker resources
                docker system prune -f --volumes || true
                '''
            }
        }

        stage('Build') {
            steps {
                // Build a fresh Docker image for the app
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Test') {
            steps {
                // Simple placeholder for tests (replace with real tests if needed)
                sh 'echo "Running tests... Simulated server test passed."'
            }
        }

        stage('Deploy') {
            steps {
                // Deploy the app on port 8081 of the host
                sh '''
                docker run -d -p 8081:8080 --name webapp $DOCKER_IMAGE
                '''
            }
        }
    }

    post {
        always {
            // Display running Docker containers after deployment for debugging
            sh 'docker ps'
        }
    }
}

