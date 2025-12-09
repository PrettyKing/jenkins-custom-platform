import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Space, Typography } from 'antd';
import { statisticsApi } from '@/api/statistics';
import { DashboardOverviewCard } from '@/components/statistics/DashboardOverviewCard';

const { Title } = Typography;

export const EnhancedDashboardPage: React.FC = () => {
  // 获取仪表盘概览数据
  const { data: overview, isLoading } = useQuery({
    queryKey: ['dashboardOverview'],
    queryFn: () => statisticsApi.getDashboardOverview(),
    refetchInterval: 30000, // 每30秒刷新一次
  });

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>仪表盘</Title>
      
      {overview?.data && (
        <DashboardOverviewCard 
          data={overview.data} 
          loading={isLoading}
        />
      )}
      
      {/* 这里可以添加更多内容,如最近构建列表等 */}
    </Space>
  );
};
