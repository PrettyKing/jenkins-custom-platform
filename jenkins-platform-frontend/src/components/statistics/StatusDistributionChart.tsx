import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { StatusDistribution } from '@/api/statistics';

interface Props {
  data: StatusDistribution[];
  loading?: boolean;
}

const COLORS: Record<string, string> = {
  SUCCESS: '#52c41a',
  FAILURE: '#ff4d4f',
  UNSTABLE: '#faad14',
  ABORTED: '#8c8c8c',
  NOT_BUILT: '#d9d9d9',
};

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: '成功',
  FAILURE: '失败',
  UNSTABLE: '不稳定',
  ABORTED: '已中止',
  NOT_BUILT: '未构建',
};

export const StatusDistributionChart: React.FC<Props> = ({ data, loading }) => {
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <Card title="构建状态分布" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => {
              const status = data[index].status;
              return <Cell key={`cell-${index}`} fill={COLORS[status] || '#d9d9d9'} />;
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
