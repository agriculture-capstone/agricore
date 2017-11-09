pipeline {
  agent: { docker 'TODO' }
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
