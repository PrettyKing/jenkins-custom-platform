import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ProjectOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { DashboardOverview } from '@/api/statistics';

interface Props {
  data: DashboardOverview;
  loading?: boolean;
}

export const DashboardOverviewCard: React.FC<Props> = ({ data, loading }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="总任务数"
            value={data.totalJobs}
            prefix={<ProjectOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="构建总数"
            value={data.totalBuilds}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="整体成功率"
            value={data.successRate}
            suffix="%"
            valueStyle={{ 
              color: data.successRate >= 80 ? '#3f8600' : data.successRate >= 60 ? '#faad14' : '#cf1322' 
            }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="正在构建"
            value={data.activeBuilds}
            prefix={<SyncOutlined spin style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading}>
          <Statistic
            title="最近失败"
            value={data.recentFailures}
            prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};
