import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TimeSeriesData } from '@/api/statistics';

interface Props {
  data: TimeSeriesData[];
  loading?: boolean;
}

export const TimeSeriesChart: React.FC<Props> = ({ data, loading }) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
    success: item.successCount,
    failure: item.failureCount,
    avgDuration: item.averageDuration,
  }));

  return (
    <Card title="每日构建统计" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" label={{ value: '构建次数', angle: -90, position: 'insideLeft' }} />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: '平均时长 (秒)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="success" fill="#52c41a" name="成功" />
          <Bar yAxisId="left" dataKey="failure" fill="#ff4d4f" name="失败" />
          <Bar yAxisId="right" dataKey="avgDuration" fill="#1890ff" name="平均时长" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
