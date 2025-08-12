import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
    try {
        console.log('🏢 Fetching facility settings...');

        // Get the first facility settings (assuming single facility for now)
        const facilitySettings = await prisma.facilitySettings.findFirst({
            include: {
                manager: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!facilitySettings) {
            console.log('❌ No facility settings found');
            return NextResponse.json(
                { error: 'No facility settings found' },
                { status: 404 }
            );
        }

        console.log('✅ Facility settings found:', facilitySettings.facility);

        return NextResponse.json({
            success: true,
            facility: {
                id: facilitySettings.id,
                name: facilitySettings.facility,
                latitude: facilitySettings.latitude,
                longitude: facilitySettings.longitude,
                radius: facilitySettings.radius,
                manager: facilitySettings.manager?.user?.name || 'Unknown',
            },
        });

    } catch (error) {
        console.error('❌ Error fetching facility settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch facility settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        console.log('🏢 Updating facility settings...');

        const body = await request.json();
        const { latitude, longitude, radius, facilityName } = body;

        // Validate inputs
        if (typeof latitude !== 'number' || typeof longitude !== 'number' || typeof radius !== 'number') {
            return NextResponse.json(
                { error: 'Invalid input: latitude, longitude, and radius must be numbers' },
                { status: 400 }
            );
        }

        if (latitude < -90 || latitude > 90) {
            return NextResponse.json(
                { error: 'Latitude must be between -90 and 90' },
                { status: 400 }
            );
        }

        if (longitude < -180 || longitude > 180) {
            return NextResponse.json(
                { error: 'Longitude must be between -180 and 180' },
                { status: 400 }
            );
        }

        if (radius <= 0) {
            return NextResponse.json(
                { error: 'Radius must be greater than 0' },
                { status: 400 }
            );
        }

        // Get the first facility settings to update
        const existingSettings = await prisma.facilitySettings.findFirst();

        if (!existingSettings) {
            return NextResponse.json(
                { error: 'No facility settings found to update' },
                { status: 404 }
            );
        }

        // Update the facility settings
        const updatedSettings = await prisma.facilitySettings.update({
            where: { id: existingSettings.id },
            data: {
                latitude,
                longitude,
                radius,
                facility: facilityName || existingSettings.facility,
            },
        });

        console.log('✅ Facility settings updated successfully');

        return NextResponse.json({
            success: true,
            facility: {
                id: updatedSettings.id,
                name: updatedSettings.facility,
                latitude: updatedSettings.latitude,
                longitude: updatedSettings.longitude,
                radius: updatedSettings.radius,
            },
        });

    } catch (error) {
        console.error('❌ Error updating facility settings:', error);
        return NextResponse.json(
            { error: 'Failed to update facility settings' },
            { status: 500 }
        );
    }
}
