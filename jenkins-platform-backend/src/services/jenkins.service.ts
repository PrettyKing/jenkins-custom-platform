import axios, { AxiosInstance } from 'axios';
import { jenkinsConfig } from '../config/jenkins.config';
import { JenkinsJob, BuildDetails, JobConfig } from '../types';

class JenkinsService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: jenkinsConfig.baseUrl,
      timeout: jenkinsConfig.timeout,
      auth: {
        username: jenkinsConfig.username,
        password: jenkinsConfig.token,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Jenkins API Error:', error.message);
        throw new Error(`Jenkins API failed: ${error.message}`);
      }
    );
  }

  /**
   * 获取所有任务列表
   */
  async getAllJobs(): Promise<JenkinsJob[]> {
    try {
      const response = await this.client.get(jenkinsConfig.endpoints.jobs);
      return response.data.jobs || [];
    } catch (error) {
      throw new Error('Failed to fetch jobs');
    }
  }

  /**
   * 获取单个任务详情
   */
  async getJob(jobName: string): Promise<any> {
    try {
      const response = await this.client.get(jenkinsConfig.endpoints.job(jobName));
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch job: ${jobName}`);
    }
  }

  /**
   * 获取构建详情
   */
  async getBuildDetails(jobName: string, buildNumber: number): Promise<BuildDetails> {
    try {
      const response = await this.client.get(
        jenkinsConfig.endpoints.build(jobName, buildNumber)
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch build details: ${jobName}#${buildNumber}`);
    }
  }

  /**
   * 获取构建日志
   */
  async getBuildLog(jobName: string, buildNumber: number): Promise<string> {
    try {
      const response = await this.client.get(
        jenkinsConfig.endpoints.buildLog(jobName, buildNumber),
        {
          headers: {
            'Content-Type': 'text/plain',
          },
          responseType: 'text',
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch build log: ${jobName}#${buildNumber}`);
    }
  }

  /**
   * 触发构建
   */
  async triggerBuild(jobName: string, parameters?: Record<string, any>): Promise<void> {
    try {
      const endpoint = parameters
        ? jenkinsConfig.endpoints.buildWithParams(jobName)
        : `/job/${jobName}/build`;

      await this.client.post(endpoint, null, {
        params: parameters,
      });
    } catch (error) {
      throw new Error(`Failed to trigger build: ${jobName}`);
    }
  }

  /**
   * 停止构建
   */
  async stopBuild(jobName: string, buildNumber: number): Promise<void> {
    try {
      await this.client.post(jenkinsConfig.endpoints.stopBuild(jobName, buildNumber));
    } catch (error) {
      throw new Error(`Failed to stop build: ${jobName}#${buildNumber}`);
    }
  }

  /**
   * 创建任务
   */
  async createJob(config: JobConfig): Promise<void> {
    try {
      // Pipeline 脚本模板
      const pipelineXml = `<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <description>${config.description || ''}</description>
  <keepDependencies>false</keepDependencies>
  <properties/>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.92">
    <script>${config.script || this.getDefaultPipelineScript(config)}</script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>`;

      await this.client.post(jenkinsConfig.endpoints.createJob, pipelineXml, {
        params: { name: config.name },
        headers: {
          'Content-Type': 'application/xml',
        },
      });
    } catch (error) {
      throw new Error(`Failed to create job: ${config.name}`);
    }
  }

  /**
   * 删除任务
   */
  async deleteJob(jobName: string): Promise<void> {
    try {
      await this.client.post(jenkinsConfig.endpoints.deleteJob(jobName));
    } catch (error) {
      throw new Error(`Failed to delete job: ${jobName}`);
    }
  }

  /**
   * 获取任务构建历史
   */
  async getBuildHistory(jobName: string, limit: number = 10): Promise<BuildDetails[]> {
    try {
      const job = await this.getJob(jobName);
      const builds = job.builds || [];
      
      const buildDetails = await Promise.all(
        builds.slice(0, limit).map((build: any) => 
          this.getBuildDetails(jobName, build.number)
        )
      );
      
      return buildDetails;
    } catch (error) {
      throw new Error(`Failed to fetch build history: ${jobName}`);
    }
  }

  /**
   * 获取默认 Pipeline 脚本
   */
  private getDefaultPipelineScript(config: JobConfig): string {
    return `
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git url: '${config.gitUrl || ''}', branch: '${config.branch || 'main'}'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building...'
                // 添加你的构建命令
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
                // 添加你的测试命令
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // 添加你的部署命令
            }
        }
    }
    
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
    `.trim();
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/json');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export default new JenkinsService();
