import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DepartmentData {
  department: string;
  count: number;
  color: string;
}

interface RealTimeActivityData {
  totalStaff: number;
  activeStaff: number;
  onBreak: number;
  offDuty: number;
  departments: DepartmentData[];
  recentActivity: {
    time: string;
    action: string;
    staffName: string;
    type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  }[];
}

interface RealTimeActivityChartProps {
  data: RealTimeActivityData;
}

export default function RealTimeActivityChart({ data }: RealTimeActivityChartProps) {
  // Generate colors for departments
  const colors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const departmentData: DepartmentData[] = (data.departments || []).map((dept, index) => ({
    department: dept.department,
    count: dept.count,
    color: colors[index % colors.length]
  }));

  const formatDepartment = (department: string) => {
    return department || 'Unassigned';
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'CLOCK_IN': return '🟢';
      case 'CLOCK_OUT': return '🔴';
      case 'BREAK_START': return '🟡';
      case 'BREAK_END': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Real-Time Activity</h3>
      
      {/* Current Status Overview */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Department Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3 text-center">Staff by Department</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {departmentData.map((entry, index) => (
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
                        <span className="text-sm text-gray-600">{departmentData[index]?.department || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Summary */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Staff</p>
            <p className="text-3xl font-bold text-gray-600">{data.totalStaff || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Currently Active</p>
            <p className="text-2xl font-bold text-green-600">{data.activeStaff || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">On Break</p>
            <p className="text-xl font-bold text-yellow-600">{data.onBreak || 0}</p>
          </div>
        </div>
      </div>

      {/* Activity Rate Indicator */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Activity Rate</h4>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${data.totalStaff > 0 ? (data.activeStaff / data.totalStaff) * 100 : 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span className="font-medium">
            {data.totalStaff > 0 ? Math.round((data.activeStaff / data.totalStaff) * 100) : 0}% Active
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mb-4">
        <h4 className="text-md font-medium text-gray-700 mb-3">Recent Activity</h4>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {!data.recentActivity || data.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <span className="text-lg">{getStatusIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {activity.staffName}
                  </p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Status Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Updates</span>
        </div>
      </div>
    </div>
  );
}
