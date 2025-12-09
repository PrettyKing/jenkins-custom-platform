import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Row, Col, Space, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { statisticsApi } from '@/api/statistics';
import { BuildStatisticsCard } from '@/components/statistics/BuildStatisticsCard';
import { StatusDistributionChart } from '@/components/statistics/StatusDistributionChart';
import { BuildDurationTrendChart } from '@/components/statistics/BuildDurationTrendChart';
import { TimeSeriesChart } from '@/components/statistics/TimeSeriesChart';

const { Title } = Typography;

export const JobStatisticsPage: React.FC = () => {
  const { jobName } = useParams<{ jobName: string }>();

  // 获取任务统计
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['jobStatistics', jobName],
    queryFn: () => statisticsApi.getJobStatistics(jobName!),
    enabled: !!jobName,
  });

  // 获取状态分布
  const { data: statusDist, isLoading: statusLoading } = useQuery({
    queryKey: ['statusDistribution', jobName],
    queryFn: () => statisticsApi.getStatusDistribution(jobName!),
    enabled: !!jobName,
  });

  // 获取构建耗时趋势
  const { data: durationTrend, isLoading: durationLoading } = useQuery({
    queryKey: ['durationTrend', jobName],
    queryFn: () => statisticsApi.getBuildDurationTrend(jobName!),
    enabled: !!jobName,
  });

  // 获取时间序列数据
  const { data: timeSeries, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ['timeSeries', jobName],
    queryFn: () => statisticsApi.getTimeSeriesData(jobName!, 7),
    enabled: !!jobName,
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>任务统计 - {jobName}</Title>

      {/* 构建统计卡片 */}
      {statistics?.data && (
        <BuildStatisticsCard 
          statistics={statistics.data} 
          loading={statsLoading}
        />
      )}

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        {/* 时间序列图 */}
        <Col xs={24} lg={12}>
          {timeSeries?.data && (
            <TimeSeriesChart 
              data={timeSeries.data} 
              loading={timeSeriesLoading}
            />
          )}
        </Col>

        {/* 状态分布图 */}
        <Col xs={24} lg={12}>
          {statusDist?.data && (
            <StatusDistributionChart 
              data={statusDist.data} 
              loading={statusLoading}
            />
          )}
        </Col>

        {/* 构建耗时趋势 */}
        <Col xs={24}>
          {durationTrend?.data && (
            <BuildDurationTrendChart 
              data={durationTrend.data} 
              loading={durationLoading}
            />
          )}
        </Col>
      </Row>
    </Space>
  );
};
