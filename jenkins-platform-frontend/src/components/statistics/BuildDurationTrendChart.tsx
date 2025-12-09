import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: Array<{ buildNumber: number; duration: number }>;
  loading?: boolean;
}

export const BuildDurationTrendChart: React.FC<Props> = ({ data, loading }) => {
  const chartData = data.map(item => ({
    build: `#${item.buildNumber}`,
    duration: item.duration,
  }));

  return (
    <Card title="构建耗时趋势" loading={loading}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="build" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: '时长 (秒)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} 秒`, '构建时长']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="duration" 
            stroke="#1890ff" 
            name="构建时长"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
