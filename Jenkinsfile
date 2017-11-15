pipeline {
  agent { dockerfile true }
  stages {
    stage('Build') {
      echo 'Building...'

      sh 'npm run build:prod'
    }
    stage('TEST') {
      echo 'Testing...'

      sh 'npm run test:core'
    }
  }
}
