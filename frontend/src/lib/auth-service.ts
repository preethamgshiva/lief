import { prisma } from './prisma';
import { Employee, User, Manager } from '@prisma/client';

export interface LoginCredentials {
    employeeId: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    user?: {
        id: string;
        email: string;
        name: string;
        role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
        employeeId?: string;
        department?: string;
        position?: string;
        facility?: string;
    };
    error?: string;
}

export interface CreateUserData {
    email: string;
    name: string;
    role: 'EMPLOYEE' | 'MANAGER';
    employeeId: string;
    department?: string;
    position?: string;
    password: string;
    facility?: string;
    hireDate?: Date;
}

export class AuthService {
    // Simple password hashing (in production, use bcrypt)
    private static hashPassword(password: string): string {
        return btoa(password + 'salt'); // Base64 encoding with salt
    }

    // Decode hashed password back to original (for display purposes)
    private static decodePassword(hashedPassword: string): string {
        try {
            const decoded = atob(hashedPassword);
            // Remove the 'salt' suffix
            return decoded.replace('salt', '');
        } catch (error) {
            return 'Password unavailable';
        }
    }

    private static verifyPassword(password: string, storedPassword: string): boolean {
        // Hash the input password and compare with stored hashed password
        const hashedInputPassword = this.hashPassword(password);
        return hashedInputPassword === storedPassword;
    }

    static async authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
        try {
            console.log('🔐 Attempting authentication for employee:', credentials.employeeId);

            // Database connection will be tested by the actual query below

            // Find employee by employee ID
            const employee = await prisma.employee.findUnique({
                where: { employeeId: credentials.employeeId },
                include: {
                    user: true,
                    manager: true,
                },
            });

            if (!employee) {
                console.log('❌ Employee not found for employee ID:', credentials.employeeId);
                return {
                    success: false,
                    error: 'Invalid employee ID or password',
                };
            }

            console.log('✅ Employee found:', employee.employeeId);

            // Check password
            if (!this.verifyPassword(credentials.password, employee.password)) {
                console.log('❌ Password mismatch for employee:', credentials.employeeId);
                return {
                    success: false,
                    error: 'Invalid employee ID or password',
                };
            }

            if (!employee.user.isActive) {
                console.log('❌ User account is deactivated for employee:', credentials.employeeId);
                return {
                    success: false,
                    error: 'Account is deactivated. Please contact your administrator.',
                };
            }

            console.log('🎉 Authentication successful for employee:', credentials.employeeId);

            return {
                success: true,
                user: {
                    id: employee.user.id,
                    email: employee.user.email,
                    name: employee.user.name,
                    role: employee.user.role,
                    employeeId: employee.employeeId,
                    department: employee.department,
                    position: employee.position,
                    facility: employee.manager?.facility,
                },
            };
        } catch (error) {
            console.error('❌ Authentication error:', error);
            return {
                success: false,
                error: 'Authentication failed. Please try again.',
            };
        }
    }

    static async createUser(userData: CreateUserData): Promise<{ user: User; employee: Employee; manager?: Manager }> {
        try {
            const hashedPassword = this.hashPassword(userData.password);

            if (userData.role === 'EMPLOYEE') {
                const result = await prisma.$transaction(async (tx) => {
                    // Create user
                    const user = await tx.user.create({
                        data: {
                            email: userData.email,
                            name: userData.name,
                            role: userData.role,
                            isActive: true,
                        },
                    });

                    // Create employee
                    const employee = await tx.employee.create({
                        data: {
                            userId: user.id,
                            employeeId: userData.employeeId,
                            department: userData.department || 'General',
                            position: userData.position || 'Employee',
                            password: hashedPassword,
                            hireDate: userData.hireDate || new Date(),
                        },
                    });

                    return { user, employee };
                });

                return result;
            } else if (userData.role === 'MANAGER') {
                const result = await prisma.$transaction(async (tx) => {
                    // Create user
                    const user = await tx.user.create({
                        data: {
                            email: userData.email,
                            name: userData.name,
                            role: userData.role,
                            isActive: true,
                        },
                    });

                    // Create employee record (required for login)
                    const employee = await tx.employee.create({
                        data: {
                            userId: user.id,
                            employeeId: userData.employeeId,
                            department: userData.department || 'Management',
                            position: userData.position || 'Manager',
                            password: hashedPassword,
                            hireDate: userData.hireDate || new Date(),
                        },
                    });

                    // Create manager record
                    const manager = await tx.manager.create({
                        data: {
                            userId: user.id,
                            facility: userData.facility || 'Main Facility',
                        },
                    });

                    return { user, employee, manager };
                });

                return result;
            }

            throw new Error('Invalid role specified');
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async getUserById(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    employee: true,
                    manager: true,
                },
            });
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
            return null;
        }
    }

    static async getAllEmployees() {
        try {
            const employees = await prisma.employee.findMany({
                select: {
                    id: true,
                    employeeId: true,
                    department: true,
                    position: true,
                    hireDate: true,
                    password: true,
                    isClockedIn: true,
                    lastClockIn: true,
                    lastClockOut: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        }
                    },
                    manager: {
                        select: {
                            id: true,
                            facility: true,
                        }
                    },
                },
            });

            // Decode passwords for display purposes
            return employees.map(employee => ({
                ...employee,
                originalPassword: this.decodePassword(employee.password)
            }));
        } catch (error) {
            console.error('Error getting all employees:', error);
            return [];
        }
    }

    static async deleteEmployee(employeeId: string) {
        try {
            const employee = await prisma.employee.findUnique({
                where: { employeeId },
                include: { user: true },
            });

            if (!employee) {
                throw new Error('Employee not found');
            }

            await prisma.$transaction(async (tx) => {
                // Delete time entries first
                await tx.timeEntry.deleteMany({
                    where: { employeeId: employee.id },
                });

                // Delete employee
                await tx.employee.delete({
                    where: { id: employee.id },
                });

                // Delete user
                await tx.user.delete({
                    where: { id: employee.userId },
                });
            });

            return true;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    static async updatePassword(employeeId: string, newPassword: string) {
        try {
            const hashedPassword = this.hashPassword(newPassword);
            const employee = await prisma.employee.update({
                where: { employeeId },
                data: { password: hashedPassword },
            });
            return employee;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }
}
