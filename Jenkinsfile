pipeline {
  agent any
  environment {
    IMAGE = 'frontend:latest'
    DEPLOY_DIR = '/opt/application'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build image') {
      steps { sh 'docker build -t $IMAGE .' }
    }
    stage('Deploy') {
      steps {
        sh 'docker compose -f $DEPLOY_DIR/docker-compose.yml up -d --no-deps --force-recreate frontend'
      }
    }
    stage('Smoke test') {
      steps {
        sh 'sleep 3 && docker exec frontend wget -qO- http://localhost/ | grep -q "Todo App"'
      }
    }
  }
}
