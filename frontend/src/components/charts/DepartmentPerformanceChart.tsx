import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DepartmentData {
  department: string;
  totalHours: number;
  staffCount: number;
  averageHours: number;
  efficiency: number; // hours per staff member
}

interface DepartmentPerformanceChartProps {
  data: DepartmentData[];
  period: 'week' | 'month' | 'year';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export default function DepartmentPerformanceChart({ data, period }: DepartmentPerformanceChartProps) {
  // Sort departments by total hours for better visualization
  const sortedData = [...data].sort((a, b) => b.totalHours - a.totalHours);

  // Calculate overall stats
  const totalHours = data.reduce((sum, dept) => sum + dept.totalHours, 0);
  const totalStaff = data.reduce((sum, dept) => sum + dept.staffCount, 0);
  const overallAverageHours = totalStaff > 0 ? totalHours / totalStaff : 0;

  // Data for pie chart (top 6 departments by hours)
  const pieData = sortedData.slice(0, 6).map((dept, index) => ({
    name: dept.department,
    value: dept.totalHours,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h3>
      
      {/* Department Hours Comparison */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Total Hours by Department</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="department" 
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
              formatter={(value: number, name: string) => [
                `${value}h`,
                name === 'totalHours' ? 'Total Hours' : 
                name === 'averageHours' ? 'Average Hours' : 'Staff Count'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="totalHours" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              name="Total Hours"
            />
            <Bar 
              dataKey="averageHours" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              name="Average Hours"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3 text-center">Hours Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
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
                formatter={(value: number) => [`${value}h`, 'Hours']}
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
            <p className="text-sm text-gray-600">Total Hours</p>
            <p className="text-3xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Staff</p>
            <p className="text-2xl font-bold text-green-600">{totalStaff}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Overall Average</p>
            <p className="text-xl font-bold text-purple-600">{overallAverageHours.toFixed(1)}h</p>
          </div>
        </div>
      </div>

      {/* Department Efficiency Table */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Department Efficiency</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-700">Department</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Staff</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Total Hours</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Avg/Staff</th>
                <th className="text-left py-2 px-3 font-medium text-gray-700">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((dept, index) => (
                <tr key={dept.department} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium">{dept.department}</td>
                  <td className="py-2 px-3">{dept.staffCount}</td>
                  <td className="py-2 px-3">{dept.totalHours.toFixed(1)}h</td>
                  <td className="py-2 px-3">{dept.averageHours.toFixed(1)}h</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dept.efficiency >= 8 ? 'bg-green-100 text-green-800' :
                      dept.efficiency >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {dept.efficiency.toFixed(1)}h/staff
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
