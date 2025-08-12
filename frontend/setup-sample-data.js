const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple password hashing function (same as in AuthService)
function hashPassword(password) {
    return Buffer.from(password + 'salt').toString('base64');
}

async function setupSampleData() {
    try {
        console.log('🚀 Setting up sample data...');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await prisma.timeEntry.deleteMany();
        await prisma.employee.deleteMany();
        await prisma.manager.deleteMany();
        await prisma.user.deleteMany();
        await prisma.facilitySettings.deleteMany();

        // Create users
        console.log('👥 Creating users...');
        const managerUser = await prisma.user.create({
            data: {
                email: 'manager@liefcare.com',
                name: 'Sarah Johnson',
                role: 'MANAGER',
            },
        });

        const employee1 = await prisma.user.create({
            data: {
                email: 'nurse1@liefcare.com',
                name: 'Emily Rodriguez',
                role: 'EMPLOYEE',
            },
        });

        const employee2 = await prisma.user.create({
            data: {
                email: 'nurse2@liefcare.com',
                name: 'Michael Chen',
                role: 'EMPLOYEE',
            },
        });

        const employee3 = await prisma.user.create({
            data: {
                email: 'care1@liefcare.com',
                name: 'Lisa Thompson',
                role: 'EMPLOYEE',
            },
        });

        const employee4 = await prisma.user.create({
            data: {
                email: 'support1@liefcare.com',
                name: 'David Wilson',
                role: 'EMPLOYEE',
            },
        });

        // Create manager
        console.log('👔 Creating manager...');
        const manager = await prisma.manager.create({
            data: {
                userId: managerUser.id,
                facility: 'Lief Care Center - Main Campus',
            },
        });

        // Create manager as an employee too (so they can login with MGR001)
        const managerEmployee = await prisma.employee.create({
            data: {
                userId: managerUser.id,
                employeeId: 'MGR001',
                department: 'Management',
                position: 'Facility Manager',
                hireDate: new Date('2022-01-01'),
                password: hashPassword('manager123'),
                managerId: manager.id,
            },
        });

        // Create facility settings
        console.log('🏢 Creating facility settings...');
        await prisma.facilitySettings.create({
            data: {
                managerId: manager.id,
                facility: 'Lief Care Center - Main Campus',
                latitude: 40.7128,
                longitude: -74.0060,
                radius: 200, // 200 meters
            },
        });

        // Create employees
        console.log('👷 Creating employees...');
        const emp1 = await prisma.employee.create({
            data: {
                userId: employee1.id,
                employeeId: 'EMP001',
                department: 'Nursing',
                position: 'Registered Nurse',
                hireDate: new Date('2023-01-15'),
                password: hashPassword('employee123'),
                managerId: manager.id,
            },
        });

        const emp2 = await prisma.employee.create({
            data: {
                userId: employee2.id,
                employeeId: 'EMP002',
                department: 'Nursing',
                position: 'Licensed Practical Nurse',
                hireDate: new Date('2023-03-20'),
                password: hashPassword('employee123'),
                managerId: manager.id,
            },
        });

        const emp3 = await prisma.employee.create({
            data: {
                userId: employee3.id,
                employeeId: 'EMP003',
                department: 'Care',
                position: 'Care Assistant',
                hireDate: new Date('2023-02-10'),
                password: hashPassword('employee123'),
                managerId: manager.id,
            },
        });

        const emp4 = await prisma.employee.create({
            data: {
                userId: employee4.id,
                employeeId: 'EMP004',
                department: 'Support',
                position: 'Support Worker',
                hireDate: new Date('2023-04-05'),
                password: hashPassword('employee123'),
                managerId: manager.id,
            },
        });

        // Create time entries for the last 7 days
        console.log('⏰ Creating time entries...');
        const now = new Date();
        const timeEntries = [];

        // Generate time entries for the last 7 days
        for (let day = 6; day >= 0; day--) {
            const date = new Date(now);
            date.setDate(date.getDate() - day);

            // Skip weekends (Saturday = 6, Sunday = 0)
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            // Morning shift (8 AM - 4 PM)
            const clockInTime = new Date(date);
            clockInTime.setHours(8, 0, 0, 0);

            const clockOutTime = new Date(date);
            clockOutTime.setHours(16, 0, 0, 0);

            // Add some variation to clock-in times (±30 minutes)
            const clockInVariation = (Math.random() - 0.5) * 60 * 60 * 1000;
            const actualClockIn = new Date(clockInTime.getTime() + clockInVariation);

            // Add some variation to clock-out times (±15 minutes)
            const clockOutVariation = (Math.random() - 0.5) * 30 * 60 * 1000;
            const actualClockOut = new Date(clockOutTime.getTime() + clockOutVariation);

            // Create entries for each employee (including manager)
            [managerEmployee, emp1, emp2, emp3, emp4].forEach((employee, index) => {
                // Skip some employees on some days for variety
                if (Math.random() < 0.1) return;

                // Clock in entry
                timeEntries.push({
                    employeeId: employee.id,
                    type: 'CLOCK_IN',
                    timestamp: actualClockIn,
                    latitude: 40.7128 + (Math.random() - 0.5) * 0.001, // Within ~100m of facility
                    longitude: -74.0060 + (Math.random() - 0.5) * 0.001,
                    notes: `Morning shift - ${employee.department} department`,
                });

                // Clock out entry
                timeEntries.push({
                    employeeId: employee.id,
                    type: 'CLOCK_OUT',
                    timestamp: actualClockOut,
                    latitude: 40.7128 + (Math.random() - 0.5) * 0.001,
                    longitude: -74.0060 + (Math.random() - 0.5) * 0.001,
                    notes: `Completed ${employee.department} shift`,
                });

                // Add some break entries (randomly)
                if (Math.random() < 0.3) {
                    const breakStart = new Date(actualClockIn.getTime() + 4 * 60 * 60 * 1000); // 4 hours after clock in
                    const breakEnd = new Date(breakStart.getTime() + 30 * 60 * 1000); // 30 minute break

                    timeEntries.push({
                        employeeId: employee.id,
                        type: 'BREAK_START',
                        timestamp: breakStart,
                        notes: 'Lunch break',
                    });

                    timeEntries.push({
                        employeeId: employee.id,
                        type: 'BREAK_END',
                        timestamp: breakEnd,
                        notes: 'Break ended',
                    });
                }
            });
        }

        // Add some current day entries (some employees currently working)
        const today = new Date();
        today.setHours(8, 0, 0, 0);

        // Manager is currently working
        timeEntries.push({
            employeeId: managerEmployee.id,
            type: 'CLOCK_IN',
            timestamp: today,
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Started morning shift',
        });

        // Employee 1 is currently working
        timeEntries.push({
            employeeId: emp1.id,
            type: 'CLOCK_IN',
            timestamp: today,
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Started morning shift',
        });

        // Employee 2 is currently working
        timeEntries.push({
            employeeId: emp2.id,
            type: 'CLOCK_IN',
            timestamp: new Date(today.getTime() + 30 * 60 * 1000), // 30 minutes later
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Started morning shift',
        });

        // Employee 3 is on break
        timeEntries.push({
            employeeId: emp3.id,
            type: 'CLOCK_IN',
            timestamp: new Date(today.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Started morning shift',
        });

        timeEntries.push({
            employeeId: emp3.id,
            type: 'BREAK_START',
            timestamp: new Date(today.getTime() - 30 * 60 * 1000), // 30 minutes ago
            notes: 'Taking lunch break',
        });

        // Employee 4 is off duty
        timeEntries.push({
            employeeId: emp4.id,
            type: 'CLOCK_IN',
            timestamp: new Date(today.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Started night shift',
        });

        timeEntries.push({
            employeeId: emp4.id,
            type: 'CLOCK_OUT',
            timestamp: new Date(today.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
            latitude: 40.7128,
            longitude: -74.0060,
            notes: 'Completed night shift',
        });

        // Insert all time entries
        for (const entry of timeEntries) {
            await prisma.timeEntry.create({
                data: entry,
            });
        }

        // Update employee clock status
        await prisma.employee.update({
            where: { id: managerEmployee.id },
            data: { isClockedIn: true, lastClockIn: today },
        });

        await prisma.employee.update({
            where: { id: emp1.id },
            data: { isClockedIn: true, lastClockIn: today },
        });

        await prisma.employee.update({
            where: { id: emp2.id },
            data: { isClockedIn: true, lastClockIn: new Date(today.getTime() + 30 * 60 * 1000) },
        });

        await prisma.employee.update({
            where: { id: emp3.id },
            data: { isClockedIn: true, lastClockIn: new Date(today.getTime() - 2 * 60 * 60 * 1000) },
        });

        await prisma.employee.update({
            where: { id: emp4.id },
            data: { isClockedIn: false, lastClockOut: new Date(today.getTime() - 1 * 60 * 60 * 1000) },
        });

        console.log('✅ Sample data setup completed successfully!');
        console.log(`📊 Created ${timeEntries.length} time entries`);
        console.log(`👥 Created ${5} employees (including manager) and 1 manager`);
        console.log(`🏢 Created facility settings`);

        console.log('\n🔑 Login Credentials:');
        console.log('Manager: MGR001 / manager123');
        console.log('Employees: EMP001, EMP002, EMP003, EMP004 / employee123');

    } catch (error) {
        console.error('❌ Error setting up sample data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setupSampleData();
