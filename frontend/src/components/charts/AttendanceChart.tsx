import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AttendanceData {
  date: string;
  present: number;
  total: number;
  attendanceRate: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  period: 'week' | 'month' | 'year';
}

export default function AttendanceChart({ data, period }: AttendanceChartProps) {
  const formatXAxis = (tickItem: string) => {
    if (period === 'week') {
      return new Date(tickItem).toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === 'month') {
      return new Date(tickItem).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return new Date(tickItem).toLocaleDateString('en-US', { month: 'short' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Attendance Rate (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Attendance Rate']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="attendanceRate" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Average Rate</p>
          <p className="text-xl font-bold text-blue-600">
            {data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.attendanceRate, 0) / data.length) : 0}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Best Day</p>
          <p className="text-xl font-bold text-green-600">
            {data.length > 0 ? Math.max(...data.map(item => item.attendanceRate)) : 0}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-xl font-bold text-gray-600">
            {data.length > 0 ? data[0].total : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
