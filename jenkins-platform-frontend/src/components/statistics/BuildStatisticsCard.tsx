import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { BuildStatistics } from '@/api/statistics';

interface Props {
  statistics: BuildStatistics;
  loading?: boolean;
}

export const BuildStatisticsCard: React.FC<Props> = ({ statistics, loading }) => {
  return (
    <Card title="构建统计" loading={loading}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="总构建次数"
            value={statistics.totalBuilds}
            prefix={<SyncOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="成功次数"
            value={statistics.successCount}
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="失败次数"
            value={statistics.failureCount}
            valueStyle={{ color: '#cf1322' }}
            prefix={<CloseCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="成功率"
            value={statistics.successRate}
            suffix="%"
            valueStyle={{ color: statistics.successRate >= 80 ? '#3f8600' : '#cf1322' }}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Statistic
            title="不稳定"
            value={statistics.unstableCount}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="已中止"
            value={statistics.abortedCount}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="平均构建时长"
            value={statistics.averageDuration}
            suffix="秒"
            prefix={<ClockCircleOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};
