import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status, reviewNotes } = body;

        if (!status) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Status is required'
                },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CONTACTED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid status. Must be one of: PENDING, APPROVED, REJECTED, CONTACTED'
                },
                { status: 400 }
            );
        }

        // Find the signup request
        const signupRequest = await prisma.signupRequest.findUnique({
            where: { id }
        });

        if (!signupRequest) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Signup request not found'
                },
                { status: 404 }
            );
        }

        // If approving, create user account and employee record
        if (status === 'APPROVED') {
            try {
                // Generate a unique employee ID
                const employeeId = `EMP${Date.now()}`;

                // Generate a default password (you can change this logic)
                const defaultPassword = 'careworker123';
                const hashedPassword = btoa(defaultPassword + 'salt');

                // Create user account
                const newUser = await prisma.user.create({
                    data: {
                        email: signupRequest.email,
                        name: signupRequest.name,
                        role: 'EMPLOYEE',
                        isActive: true
                    }
                });

                // Create employee record
                const newEmployee = await prisma.employee.create({
                    data: {
                        userId: newUser.id,
                        employeeId: employeeId,
                        department: signupRequest.preferredDepartment || 'Care',
                        position: 'Care Worker',
                        hireDate: new Date(),
                        password: hashedPassword,
                        isClockedIn: false
                    }
                });

                console.log(`✅ Created new user account and employee record for approved application: ${signupRequest.email}`);
                console.log(`   User ID: ${newUser.id}, Employee ID: ${newEmployee.employeeId}`);

            } catch (createError) {
                console.error('❌ Error creating user account for approved application:', createError);

                // If user creation fails, don't approve the application
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Failed to create user account for approved application',
                        details: createError instanceof Error ? createError.message : 'Unknown error'
                    },
                    { status: 500 }
                );
            }
        }

        // Update the signup request status
        const updatedRequest = await prisma.signupRequest.update({
            where: { id },
            data: {
                status,
                reviewNotes: reviewNotes || null,
                reviewedAt: new Date(),
                updatedAt: new Date()
            }
        });

        console.log(`✅ Signup request ${id} status updated to: ${status}`);

        return NextResponse.json({
            success: true,
            message: status === 'APPROVED'
                ? 'Application approved and user account created successfully'
                : 'Signup request status updated successfully',
            signupRequest: updatedRequest
        });

    } catch (error) {
        console.error('❌ Error updating signup request status:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update signup request status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
