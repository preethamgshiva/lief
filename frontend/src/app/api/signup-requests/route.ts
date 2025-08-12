import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, experience, preferredDepartment, message } = body;

        // Validate required fields
        if (!name || !email || !phone || !experience) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: name, email, phone, and experience are required'
                },
                { status: 400 }
            );
        }

        // Check if email already exists in signup requests
        const existingRequest = await prisma.signupRequest.findUnique({
            where: { email }
        });

        if (existingRequest) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'An application with this email already exists'
                },
                { status: 409 }
            );
        }

        // Check if email already exists as an active user
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'A user with this email already exists in our system'
                },
                { status: 409 }
            );
        }

        // Create signup request
        const signupRequest = await prisma.signupRequest.create({
            data: {
                name,
                email,
                phone,
                experience,
                preferredDepartment: preferredDepartment || null,
                message: message || null,
                status: 'PENDING',
                submittedAt: new Date()
            }
        });

        console.log('✅ New signup request created:', signupRequest.email);

        return NextResponse.json({
            success: true,
            message: 'Signup request submitted successfully',
            requestId: signupRequest.id,
            timestamp: signupRequest.submittedAt
        });

    } catch (error) {
        console.error('❌ Error creating signup request:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to submit signup request',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Get all signup requests (for managers to review)
        const signupRequests = await prisma.signupRequest.findMany({
            orderBy: {
                submittedAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            signupRequests,
            count: signupRequests.length
        });

    } catch (error) {
        console.error('❌ Error fetching signup requests:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch signup requests',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
