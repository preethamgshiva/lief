import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface HoursData {
  staffId: string;
  name: string;
  hours: number;
  department?: string;
}

interface WeeklyHoursData {
  week: string;
  totalHours: number;
  averageHours: number;
  staffCount: number;
}

interface HoursWorkedChartProps {
  staffHours: HoursData[];
  weeklyTrends: WeeklyHoursData[];
  period: 'week' | 'month' | 'year';
}

export default function HoursWorkedChart({ staffHours, weeklyTrends, period }: HoursWorkedChartProps) {
  // Sort staff by hours for better visualization
  const sortedStaffHours = [...staffHours].sort((a, b) => b.hours - a.hours);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Hours Worked Analysis</h3>
      
      {/* Staff Hours Comparison */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Staff Hours This {period}</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sortedStaffHours.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}h`, 'Hours Worked']}
            />
            <Legend />
            <Bar 
              dataKey="hours" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Trends */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Weekly Hours Trend</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.replace('W', 'Week ')}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}h`, 'Hours']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="totalHours" 
              stroke="#3B82F6" 
              strokeWidth={3}
              name="Total Hours"
            />
            <Line 
              type="monotone" 
              dataKey="averageHours" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Average Hours"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-xl font-bold text-green-600">
            {staffHours.reduce((sum, staff) => sum + staff.hours, 0).toFixed(1)}h
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Average/Staff</p>
          <p className="text-xl font-bold text-blue-600">
            {staffHours.length > 0 ? (staffHours.reduce((sum, staff) => sum + staff.hours, 0) / staffHours.length).toFixed(1) : 0}h
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Top Performer</p>
          <p className="text-xl font-bold text-purple-600">
            {staffHours.length > 0 ? staffHours[0].hours.toFixed(1) : 0}h
          </p>
        </div>
      </div>
    </div>
  );
}
