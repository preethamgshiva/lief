-- Update existing database schema to remove Auth0 dependencies
-- Run this in your Supabase SQL editor

-- Step 1: Make auth0Id nullable (if it exists)
ALTER TABLE "public"."users" ALTER COLUMN "auth0Id" DROP NOT NULL;

-- Step 2: Make password required for staff members
ALTER TABLE "public"."staff_members" ALTER COLUMN "password" SET NOT NULL;

-- Step 3: Remove picture column if it exists
ALTER TABLE "public"."users" DROP COLUMN IF EXISTS "picture";

-- Step 4: Update existing users to have passwords if they don't
UPDATE "public"."staff_members" 
SET "password" = 'default123' 
WHERE "password" IS NULL;

-- Step 5: Create demo users if they don't exist
INSERT INTO "public"."users" ("id", "email", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES 
  ('demo-manager-1', 'manager@lief.com', 'Demo Manager', 'MANAGER', true, NOW(), NOW()),
  ('demo-careworker-1', 'careworker@lief.com', 'Demo Care Worker', 'CARE_WORKER', true, NOW(), NOW()),
  ('demo-manager-2', 'manager2@lief.com', 'Demo Manager 2', 'MANAGER', true, NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;

-- Step 6: Create demo staff members if they don't exist
INSERT INTO "public"."staff_members" ("id", "userId", "employeeId", "department", "position", "password", "createdAt", "updatedAt")
VALUES 
  ('demo-staff-1', 'demo-manager-1', 'EMP001', 'Management', 'Senior Manager', 'manager123', NOW(), NOW()),
  ('demo-staff-2', 'demo-careworker-1', 'EMP002', 'Care', 'Care Worker', 'careworker123', NOW(), NOW()),
  ('demo-staff-3', 'demo-manager-2', 'EMP003', 'Management', 'Manager', 'manager123', NOW(), NOW())
ON CONFLICT ("employeeId") DO NOTHING;

-- Step 7: Verify the changes
SELECT 
  u.email,
  u.name,
  u.role,
  sm.employeeId,
  sm.department,
  sm.password IS NOT NULL as has_password
FROM "public"."users" u
LEFT JOIN "public"."staff_members" sm ON u.id = sm.userId
ORDER BY sm.employeeId;
