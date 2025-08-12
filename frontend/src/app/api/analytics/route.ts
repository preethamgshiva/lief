import { NextRequest, NextResponse } from 'next/server';
import { TimeEntryService } from '../../../lib/time-entry-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const department = searchParams.get('department');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        console.log('📊 Fetching analytics data');

        let data: any = {};

        if (employeeId) {
            // Get stats for specific employee
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            const stats = await TimeEntryService.getEmployeeStats(employeeId, start, end);
            const clockStatus = await TimeEntryService.getCurrentClockStatus(employeeId);

            data = {
                employeeStats: stats,
                clockStatus,
            };
        } else if (department) {
            // Get stats for specific department
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            const deptStats = await TimeEntryService.getDepartmentStats(department, start, end);

            data = {
                departmentStats: deptStats,
            };
        } else {
            // Get overall stats
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            const allTimeEntries = await TimeEntryService.getAllTimeEntries(start, end);
            const allEmployees = await TimeEntryService.getAllEmployees();

            // Calculate overall statistics
            const totalClockIns = allTimeEntries.filter(entry => entry.type === 'CLOCK_IN').length;
            const totalClockOuts = allTimeEntries.filter(entry => entry.type === 'CLOCK_OUT').length;
            const totalBreaks = allTimeEntries.filter(entry =>
                entry.type === 'BREAK_START' || entry.type === 'BREAK_END'
            ).length;

            // Calculate real-time status
            const activeStaff = allEmployees.filter(emp => emp.isClockedIn).length;
            const totalStaff = allEmployees.length;
            const onBreak = 0; // TODO: Implement break tracking
            const offDuty = totalStaff - activeStaff - onBreak;

            // Calculate department breakdown
            const departmentStats = allEmployees.reduce((acc: any, emp) => {
                const dept = emp.department || 'Unassigned';
                if (!acc[dept]) acc[dept] = 0;
                acc[dept]++;
                return acc;
            }, {});

            const departments = Object.entries(departmentStats).map(([dept, count]) => ({
                department: dept,
                count: count as number
            }));

            // Get recent activity (last 10 time entries)
            const recentActivity = allTimeEntries
                .slice(0, 10)
                .map(entry => ({
                    time: entry.timestamp.toLocaleTimeString(),
                    action: `${entry.type === 'CLOCK_IN' ? 'Clocked In' : 'Clocked Out'}`,
                    staffName: entry.employee?.user?.name || 'Unknown',
                    type: entry.type
                }));

            data = {
                overallStats: {
                    totalTimeEntries: allTimeEntries.length,
                    totalClockIns,
                    totalClockOuts,
                    totalBreaks,
                    period: {
                        start: start,
                        end: end,
                    },
                },
                realTimeStats: {
                    totalStaff,
                    activeStaff,
                    onBreak,
                    offDuty,
                    departments,
                    recentActivity
                }
            };
        }

        return NextResponse.json({
            success: true,
            data,
        });

    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch analytics data'
            },
            { status: 500 }
        );
    }
}
