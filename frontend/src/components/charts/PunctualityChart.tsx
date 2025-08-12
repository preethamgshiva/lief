import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PunctualityData {
  date: string;
  totalArrivals: number;
  lateArrivals: number;
  punctualityRate: number;
  averageMinutesLate: number;
}

interface PunctualityChartProps {
  data: PunctualityData[];
  period: 'week' | 'month' | 'year';
}

export default function PunctualityChart({ data, period }: PunctualityChartProps) {
  const formatXAxis = (tickItem: string) => {
    if (period === 'week') {
      return new Date(tickItem).toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === 'month') {
      return new Date(tickItem).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return new Date(tickItem).toLocaleDateString('en-US', { month: 'short' });
    }
  };

  // Calculate overall punctuality stats
  const totalArrivals = data.reduce((sum, item) => sum + item.totalArrivals, 0);
  const totalLateArrivals = data.reduce((sum, item) => sum + item.lateArrivals, 0);
  const overallPunctualityRate = totalArrivals > 0 ? Math.round(((totalArrivals - totalLateArrivals) / totalArrivals) * 100) : 100;
  const averageMinutesLate = data.reduce((sum, item) => sum + item.averageMinutesLate, 0) / data.length;

  // Data for pie chart
  const pieData = [
    { name: 'On Time', value: totalArrivals - totalLateArrivals, color: '#10B981' },
    { name: 'Late', value: totalLateArrivals, color: '#EF4444' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Punctuality Analysis</h3>
      
      {/* Daily Punctuality Trends */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Daily Punctuality Rate</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Punctuality Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'punctualityRate' ? `${value}%` : value,
                name === 'punctualityRate' ? 'Punctuality Rate' : 'Late Arrivals'
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Bar 
              dataKey="punctualityRate" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="Punctuality Rate"
            />
            <Bar 
              dataKey="lateArrivals" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
              name="Late Arrivals"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overall Punctuality Overview */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3 text-center">Overall Punctuality</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Staff Members']}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {payload?.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-gray-600">{pieData[index]?.name || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Overall Punctuality</p>
            <p className="text-3xl font-bold text-green-600">{overallPunctualityRate}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Minutes Late</p>
            <p className="text-2xl font-bold text-red-600">{averageMinutesLate.toFixed(1)}m</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Late Arrivals</p>
            <p className="text-xl font-bold text-red-600">{totalLateArrivals}</p>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Best Day</p>
          <p className="text-lg font-bold text-green-600">
            {data.length > 0 ? Math.max(...data.map(item => item.punctualityRate)) : 0}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Worst Day</p>
          <p className="text-lg font-bold text-red-600">
            {data.length > 0 ? Math.min(...data.map(item => item.punctualityRate)) : 0}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Arrivals</p>
          <p className="text-lg font-bold text-gray-600">{totalArrivals}</p>
        </div>
      </div>
    </div>
  );
}
