pipeline {
  agent: { dockerfile true }
  stages: {
    stage('Build') {
      echo 'Building...'

      npm run build:prod
    }
    stage('TEST') {
      echo 'Testing...'

      npm run test:core
    }
  }
}
