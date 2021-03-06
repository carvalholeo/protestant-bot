'use strict';
const scanner = require('sonarqube-scanner');
const dotenv = require('dotenv');

dotenv.config();

const serverUrl = process.env.SONAR_SERVER_URL;
const loginToken = process.env.SONAR_TOKEN;
const projectKey = process.env.SONAR_PROJECT_KEY;

scanner(
  {
    serverUrl : serverUrl,
    token : loginToken,
    options: {
      'sonar.projectName': 'Protestan Bot',
      'sonar.projectKey': projectKey,
      'sonar.projectVersion': '1.0',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.sources': '.',
    }
  },
  () => process.exit()
);
