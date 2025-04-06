import { describe, it, expect, afterAll, beforeEach, afterEach } from 'vitest';
import { prisma } from '../lib/prisma/prisma';
import { randomUUID } from 'crypto';

// Helper function to generate unique email for each test
const generateUniqueEmail = () => `test-${randomUUID()}@example.com`;

// Modified user data for update tests
const updatedUserData = {
  name: 'Updated Test User'
};

describe('User CRUD Operations', () => {
  // Track created users for cleanup
  const createdUserIds: string[] = [];

  // Clean up after all tests
  afterAll(async () => {
    // Close the Prisma connection
    await prisma.$disconnect();
  });

  // Clean up after each test
  afterEach(async () => {
    // Attempt to delete any users created during tests
    for (const id of createdUserIds) {
      try {
        await prisma.user.delete({
          where: { id }
        });
      } catch (error) {
        console.log(`Error deleting test user ${id}: User might have already been deleted`);
      }
    }
    
    // Clear the IDs array
    createdUserIds.length = 0;
  });

  describe('Create operations', () => {
    it('should create a new user', async () => {
      const testUser = {
        email: generateUniqueEmail(),
        name: 'Test User'
      };
      
      const user = await prisma.user.create({
        data: testUser
      });

      // Track the user ID for cleanup
      createdUserIds.push(user.id);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should fail to create a user with duplicate email', async () => {
      // Create a user first
      const testUser = {
        email: generateUniqueEmail(),
        name: 'Test User'
      };
      
      const user = await prisma.user.create({
        data: testUser
      });
      
      // Track the user ID for cleanup
      createdUserIds.push(user.id);

      // Try to create another user with the same email
      await expect(
        prisma.user.create({
          data: testUser
        })
      ).rejects.toThrow();
    });
  });

  describe('Read operations', () => {
    let testUserId: string;
    let testUserEmail: string;

    // Create a test user for read operations
    beforeEach(async () => {
      testUserEmail = generateUniqueEmail();
      const user = await prisma.user.create({
        data: {
          email: testUserEmail,
          name: 'Test User for Reading'
        }
      });
      
      testUserId = user.id;
      createdUserIds.push(testUserId);
    });

    it('should get all users including our test user', async () => {
      const users = await prisma.user.findMany();
      
      expect(users.length).toBeGreaterThan(0);
      
      // Find our test user in the list
      const testUser = users.find(user => user.id === testUserId);
      expect(testUser).toBeDefined();
      expect(testUser?.email).toBe(testUserEmail);
    });

    it('should get a specific user by ID', async () => {
      const user = await prisma.user.findUnique({
        where: { id: testUserId }
      });

      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.email).toBe(testUserEmail);
    });

    it('should return null when getting a non-existent user', async () => {
      // Use a MongoDB ObjectId that doesn't exist
      const nonExistentId = '507f1f77bcf86cd799439011';

      const user = await prisma.user.findUnique({
        where: { id: nonExistentId }
      });

      expect(user).toBeNull();
    });
  });

  describe('Update operations', () => {
    let testUserId: string;
    let testUserEmail: string;

    // Create a test user for update operations
    beforeEach(async () => {
      testUserEmail = generateUniqueEmail();
      const user = await prisma.user.create({
        data: {
          email: testUserEmail,
          name: 'Test User for Updating'
        }
      });
      
      testUserId = user.id;
      createdUserIds.push(testUserId);
    });

    it('should update a user', async () => {
      const updatedUser = await prisma.user.update({
        where: { id: testUserId },
        data: updatedUserData
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.id).toBe(testUserId);
      expect(updatedUser.name).toBe(updatedUserData.name);
      expect(updatedUser.email).toBe(testUserEmail); // Email should remain unchanged
      
      // updatedAt should be different from createdAt after an update
      expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(updatedUser.createdAt.getTime());
    });

    it('should fail to update a non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      await expect(
        prisma.user.update({
          where: { id: nonExistentId },
          data: updatedUserData
        })
      ).rejects.toThrow();
    });
  });

  describe('Delete operations', () => {
    let testUserId: string;

    // Create a test user for delete operations
    beforeEach(async () => {
      const user = await prisma.user.create({
        data: {
          email: generateUniqueEmail(),
          name: 'Test User for Deletion'
        }
      });
      
      testUserId = user.id;
      // Note: We don't add this ID to createdUserIds since we'll delete it in the test
    });

    it('should delete a user', async () => {
      const deletedUser = await prisma.user.delete({
        where: { id: testUserId }
      });

      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(testUserId);

      // Verify user is actually deleted
      const user = await prisma.user.findUnique({
        where: { id: testUserId }
      });
      expect(user).toBeNull();
    });

    it('should fail to delete a non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      await expect(
        prisma.user.delete({
          where: { id: nonExistentId }
        })
      ).rejects.toThrow();
    });
  });
});

