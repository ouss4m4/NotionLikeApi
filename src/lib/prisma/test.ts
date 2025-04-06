import { prisma } from "./prisma";

/**
 * Test function to verify Prisma client connection
 * Counts the number of users in the database
 */
async function testPrismaConnection(): Promise<void> {
  try {
    console.log("Testing Prisma client connection...");

    // Perform a simple query to count users
    const userCount = await prisma.user.count();

    console.log("Connection successful! ✅");
    console.log(`Number of users in database: ${userCount}`);

    // Additional test: list collections in the database
    const collections = await prisma.$runCommandRaw({
      listCollections: 1,
    });

    console.log("Available collections:");
    console.log(collections);
  } catch (error) {
    console.error("❌ Error connecting to database:");
    console.error(error);
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
}

// Execute the test
testPrismaConnection().catch((error) => {
  console.error("Unhandled error in test script:");
  console.error(error);
  process.exit(1);
});
