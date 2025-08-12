import { NextRequest, NextResponse } from 'next/server';
import { TimeEntryService } from '../../../lib/time-entry-service';

export async function POST(request: NextRequest) {
    try {
        console.log('⏰ Creating time entry');

        const body = await request.json();
        const { employeeId, type, latitude, longitude, note } = body;

        // Validate required fields
        if (!employeeId || !type) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Employee ID and entry type are required'
                },
                { status: 400 }
            );
        }

        // Validate entry type
        if (!['CLOCK_IN', 'CLOCK_OUT', 'BREAK_START', 'BREAK_END'].includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid entry type'
                },
                { status: 400 }
            );
        }

        const timeEntryData = {
            employeeId,
            type,
            latitude,
            longitude,
            note,
        };

        const timeEntry = await TimeEntryService.createTimeEntry(timeEntryData);

        console.log('✅ Time entry created successfully:', timeEntry.id);

        return NextResponse.json({
            success: true,
            timeEntry,
            message: 'Time entry created successfully',
        });

    } catch (error) {
        console.error('❌ Error creating time entry:', error);
        console.error('❌ Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : 'Unknown'
        });
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create time entry'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        console.log('📋 Fetching time entries');

        let timeEntries;

        if (employeeId) {
            // Get time entries for specific employee
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            timeEntries = await TimeEntryService.getEmployeeTimeEntries(employeeId, start, end);
        } else {
            // Get all time entries
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            timeEntries = await TimeEntryService.getAllTimeEntries(start, end);
        }

        return NextResponse.json({
            success: true,
            timeEntries,
        });

    } catch (error) {
        console.error('❌ Error fetching time entries:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch time entries'
            },
            { status: 500 }
        );
    }
}
