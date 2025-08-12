import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../lib/auth-service';

export async function GET() {
    try {
        console.log('📋 Fetching all employees');

        const employees = await AuthService.getAllEmployees();

        return NextResponse.json({
            success: true,
            employees,
        });
    } catch (error) {
        console.error('❌ Error fetching employees:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch employees'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('➕ Creating new employee');

        const body = await request.json();
        const { email, name, role, employeeId, department, position, password, facility, hireDate } = body;

        // Validate required fields
        if (!email || !name || !role || !employeeId || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields'
                },
                { status: 400 }
            );
        }

        // Validate role
        if (!['EMPLOYEE', 'MANAGER'].includes(role)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid role specified'
                },
                { status: 400 }
            );
        }

        const userData = {
            email,
            name,
            role,
            employeeId,
            department,
            position,
            password,
            facility,
            hireDate: hireDate ? new Date(hireDate) : undefined,
        };

        const result = await AuthService.createUser(userData);

        console.log('✅ Employee created successfully:', result.user.email);

        const responseData: any = {
            success: true,
            user: result.user,
            employee: result.employee,
            message: 'Staff member created successfully',
        };

        if (result.manager) {
            responseData.manager = result.manager;
            responseData.message = 'Manager created successfully';
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('❌ Error creating employee:', error);

        // Handle duplicate employee ID error
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Employee ID already exists'
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create employee'
            },
            { status: 500 }
        );
    }
}
