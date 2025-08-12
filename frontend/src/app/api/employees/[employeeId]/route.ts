import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../lib/auth-service';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ employeeId: string }> }
) {
    try {
        const { employeeId } = await params;

        if (!employeeId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Employee ID is required'
                },
                { status: 400 }
            );
        }

        console.log('🗑️ Deleting employee:', employeeId);

        await AuthService.deleteEmployee(employeeId);

        console.log('✅ Employee deleted successfully:', employeeId);

        return NextResponse.json({
            success: true,
            message: 'Employee deleted successfully',
        });

    } catch (error) {
        console.error('❌ Error deleting employee:', error);

        if (error instanceof Error && error.message.includes('not found')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Employee not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete employee'
            },
            { status: 500 }
        );
    }
}
