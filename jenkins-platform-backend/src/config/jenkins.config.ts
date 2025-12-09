import dotenv from 'dotenv';

dotenv.config();

export const jenkinsConfig = {
  baseUrl: process.env.JENKINS_URL || 'http://localhost:8080',
  username: process.env.JENKINS_USER || 'admin',
  token: process.env.JENKINS_TOKEN || '',
  
  // Jenkins API 端点
  endpoints: {
    jobs: '/api/json?tree=jobs[name,url,color,displayName,description,buildable,lastBuild[number,url,result,timestamp,duration,building],lastSuccessfulBuild[number],lastFailedBuild[number]]',
    job: (name: string) => `/job/${name}/api/json`,
    build: (name: string, number: number) => `/job/${name}/${number}/api/json`,
    buildLog: (name: string, number: number) => `/job/${name}/${number}/consoleText`,
    buildWithParams: (name: string) => `/job/${name}/buildWithParameters`,
    createJob: '/createItem',
    deleteJob: (name: string) => `/job/${name}/doDelete`,
    stopBuild: (name: string, number: number) => `/job/${name}/${number}/stop`,
  },
  
  // 请求配置
  timeout: 30000,
  retries: 3,
};

export default jenkinsConfig;
