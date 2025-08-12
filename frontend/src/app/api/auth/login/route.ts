import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth-service';

export async function POST(request: NextRequest) {
    try {
        console.log('🔐 Login attempt received');

        const body = await request.json();
        const { employeeId, password } = body;

        if (!employeeId || !password) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Employee ID and password are required'
                },
                { status: 400 }
            );
        }

        console.log('🚀 Attempting authentication for employee:', employeeId);

        const authResult = await AuthService.authenticateUser({ employeeId, password });

        if (!authResult.success) {
            console.log('❌ Authentication failed:', authResult.error);
            return NextResponse.json(
                {
                    success: false,
                    error: authResult.error || 'Authentication failed'
                },
                { status: 401 }
            );
        }

        console.log('✅ Authentication successful for employee:', employeeId);

        // Return user data for client-side state management
        const userData = {
            id: authResult.user!.id,
            email: authResult.user!.email,
            name: authResult.user!.name,
            role: authResult.user!.role,
            employeeId: authResult.user!.employeeId,
            department: authResult.user!.department,
            position: authResult.user!.position,
            facility: authResult.user!.facility,
        };

        return NextResponse.json({
            success: true,
            user: userData,
            message: 'Login successful',
        });

    } catch (error) {
        console.error('💥 Login API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}
