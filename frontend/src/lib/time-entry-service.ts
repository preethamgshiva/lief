import { prisma } from './prisma';
import { $Enums } from '@prisma/client';

export interface TimeEntryData {
    employeeId: string;
    type: $Enums.EntryType;
    latitude?: number;
    longitude?: number;
    note?: string;
}

export interface TimeEntryStats {
    totalHours: number;
    totalDays: number;
    averageHoursPerDay: number;
    clockIns: number;
    clockOuts: number;
}

export class TimeEntryService {
    static async createTimeEntry(data: TimeEntryData) {
        try {
            console.log('🔍 Creating time entry with data:', data);

            // First, find the employee by their employeeId string to get the MongoDB ObjectId
            const employee = await prisma.employee.findUnique({
                where: { employeeId: data.employeeId },
                select: { id: true }
            });

            console.log('👤 Found employee:', employee);

            if (!employee) {
                throw new Error(`Employee with ID ${data.employeeId} not found`);
            }

            // Validate clock-in/out sequence
            if (data.type === 'CLOCK_OUT') {
                console.log('🔍 Validating clock-out - checking for previous clock-in...');

                // Alternative approach: check if employee is currently clocked in
                const currentEmployee = await prisma.employee.findUnique({
                    where: { id: employee.id },
                    select: { isClockedIn: true }
                });

                console.log('🔍 Current employee clock status:', currentEmployee);

                if (!currentEmployee || !currentEmployee.isClockedIn) {
                    console.log('❌ Validation failed - employee not clocked in');
                    throw new Error('Cannot clock out - employee is not currently clocked in');
                }

                console.log('✅ Validation passed - employee is clocked in');
            }

            console.log('📝 Creating time entry in database...');

            const timeEntry = await prisma.timeEntry.create({
                data: {
                    employeeId: employee.id, // Use the MongoDB ObjectId
                    type: data.type,
                    timestamp: new Date(),
                    latitude: data.latitude,
                    longitude: data.longitude,
                    notes: data.note,
                },
                include: {
                    employee: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            console.log('✅ Time entry created:', timeEntry.id);

            // Update employee clock status using the MongoDB ObjectId
            if (data.type === 'CLOCK_IN') {
                console.log('🔄 Updating employee clock-in status...');
                await prisma.employee.update({
                    where: { id: employee.id },
                    data: {
                        isClockedIn: true,
                        lastClockIn: new Date(),
                    },
                });
                console.log('✅ Employee clock-in status updated');
            } else if (data.type === 'CLOCK_OUT') {
                console.log('🔄 Updating employee clock-out status...');
                await prisma.employee.update({
                    where: { id: employee.id },
                    data: {
                        isClockedIn: false,
                        lastClockOut: new Date(),
                    },
                });
                console.log('✅ Employee clock-out status updated');
            }

            return timeEntry;
        } catch (error) {
            console.error('Error creating time entry:', error);
            throw error;
        }
    }

    static async getEmployeeTimeEntries(employeeId: string, startDate?: Date, endDate?: Date) {
        try {
            // First, find the employee by their employeeId string to get the MongoDB ObjectId
            const employee = await prisma.employee.findUnique({
                where: { employeeId: employeeId },
                select: { id: true }
            });

            if (!employee) {
                console.error(`Employee with ID ${employeeId} not found`);
                return [];
            }

            const where: any = { employeeId: employee.id }; // Use the MongoDB ObjectId

            if (startDate && endDate) {
                where.timestamp = {
                    gte: startDate,
                    lte: endDate,
                };
            }

            const timeEntries = await prisma.timeEntry.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                include: {
                    employee: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return timeEntries;
        } catch (error) {
            console.error('Error getting employee time entries:', error);
            return [];
        }
    }

    static async getEmployeeStats(employeeId: string, startDate?: Date, endDate?: Date): Promise<TimeEntryStats> {
        try {
            const where: any = { employeeId };

            if (startDate && endDate) {
                where.timestamp = {
                    gte: startDate,
                    lte: endDate,
                };
            }

            const timeEntries = await prisma.timeEntry.findMany({
                where,
                orderBy: { timestamp: 'asc' },
            });

            let totalHours = 0;
            let totalDays = 0;
            let clockIns = 0;
            let clockOuts = 0;
            let currentClockIn: Date | null = null;

            for (const entry of timeEntries as any[]) {
                if (entry.type === $Enums.EntryType.CLOCK_IN) {
                    currentClockIn = entry.timestamp;
                    clockIns++;
                } else if (entry.type === $Enums.EntryType.CLOCK_OUT && currentClockIn) {
                    const hours = (entry.timestamp.getTime() - currentClockIn.getTime()) / (1000 * 60 * 60);
                    totalHours += hours;
                    totalDays++;
                    currentClockIn = null;
                    clockOuts++;
                }
            }

            return {
                totalHours: Math.round(totalHours * 100) / 100,
                totalDays,
                averageHoursPerDay: totalDays > 0 ? Math.round((totalHours / totalDays) * 100) / 100 : 0,
                clockIns,
                clockOuts,
            };
        } catch (error) {
            console.error('Error getting employee stats:', error);
            return {
                totalHours: 0,
                totalDays: 0,
                averageHoursPerDay: 0,
                clockIns: 0,
                clockOuts: 0,
            };
        }
    }

    static async getAllTimeEntries(startDate?: Date, endDate?: Date) {
        try {
            const where: any = {};

            if (startDate && endDate) {
                where.timestamp = {
                    gte: startDate,
                    lte: endDate,
                };
            }

            const timeEntries = await prisma.timeEntry.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                include: {
                    employee: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return timeEntries;
        } catch (error) {
            console.error('Error getting all time entries:', error);
            return [];
        }
    }

    static async getAllEmployees() {
        try {
            return await prisma.employee.findMany({
                select: {
                    id: true,
                    employeeId: true,
                    department: true,
                    position: true,
                    isClockedIn: true,
                    lastClockIn: true,
                    lastClockOut: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                },
            });
        } catch (error) {
            console.error('Error getting all employees:', error);
            return [];
        }
    }

    static async getDepartmentStats(department: string, startDate?: Date, endDate?: Date) {
        try {
            const employees = await prisma.employee.findMany({
                where: { department },
                include: {
                    user: true,
                    timeEntries: {
                        where: startDate && endDate ? {
                            timestamp: {
                                gte: startDate,
                                lte: endDate,
                            },
                        } : {},
                    },
                },
            });

            const stats = employees.map(employee => {
                const clockIns = employee.timeEntries.filter(entry => entry.type === 'CLOCK_IN').length;
                const clockOuts = employee.timeEntries.filter(entry => entry.type === 'CLOCK_OUT').length;

                return {
                    employeeId: employee.employeeId,
                    name: employee.user.name,
                    department: employee.department,
                    position: employee.position,
                    clockIns,
                    clockOuts,
                    isClockedIn: employee.isClockedIn,
                };
            });

            return stats;
        } catch (error) {
            console.error('Error getting department stats:', error);
            return [];
        }
    }

    static async getCurrentClockStatus(employeeId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { id: employeeId },
                select: {
                    isClockedIn: true,
                    lastClockIn: true,
                    lastClockOut: true,
                },
            });

            return employee;
        } catch (error) {
            console.error('Error getting current clock status:', error);
            return null;
        }
    }
}
