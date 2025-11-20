const { User, WeightMeasurement } = require('../models');

const seedTestData = async () => {
  try {
    console.log('🌱 Seeding test data...');

    // Create test users
    const testUsers = [
      {
        email: 'john.doe@example.com',
        password: 'TestPass123!',
        firstName: 'John',
        lastName: 'Doe',
        height: 1.75,
        dateOfBirth: '1990-01-15',
        gender: 'male'
      },
      {
        email: 'jane.smith@example.com',
        password: 'TestPass123!',
        firstName: 'Jane',
        lastName: 'Smith',
        height: 1.65,
        dateOfBirth: '1985-03-22',
        gender: 'female'
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.email}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`ℹ️  User already exists: ${userData.email}`);
      }
    }

    // Create test weight measurements
    const now = new Date();
    const testMeasurements = [];

    // Generate measurements for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // John's measurements (gradual weight loss)
      testMeasurements.push({
        userId: createdUsers[0].id,
        weight: 80 - (i * 0.1), // Gradual weight loss
        unit: 'kg',
        bodyFat: 20 - (i * 0.05),
        muscleMass: 35 + (i * 0.02),
        boneMass: 3.2,
        waterPercentage: 60 + (i * 0.1),
        timestamp: date,
        notes: i === 0 ? 'Latest measurement' : `Day ${i + 1} measurement`
      });

      // Jane's measurements (weight maintenance)
      if (createdUsers[1]) {
        testMeasurements.push({
          userId: createdUsers[1].id,
          weight: 65 + (Math.random() - 0.5) * 2, // Random fluctuation around 65kg
          unit: 'kg',
          bodyFat: 22 + (Math.random() - 0.5) * 2,
          muscleMass: 28 + (Math.random() - 0.5) * 1,
          boneMass: 2.8,
          waterPercentage: 58 + (Math.random() - 0.5) * 4,
          timestamp: date,
          notes: i === 0 ? 'Latest measurement' : `Day ${i + 1} measurement`
        });
      }
    }

    // Insert measurements
    let createdCount = 0;
    for (const measurementData of testMeasurements) {
      const existing = await WeightMeasurement.findOne({
        where: {
          userId: measurementData.userId,
          timestamp: measurementData.timestamp
        }
      });

      if (!existing) {
        await WeightMeasurement.create(measurementData);
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} weight measurements`);
    console.log('🎉 Test data seeding completed!');

    return {
      users: createdUsers,
      measurementsCreated: createdCount
    };

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
};

const clearTestData = async () => {
  try {
    console.log('🧹 Clearing test data...');

    // Delete test measurements
    const deletedMeasurements = await WeightMeasurement.destroy({
      where: {},
      force: true
    });

    // Delete test users
    const deletedUsers = await User.destroy({
      where: {
        email: ['john.doe@example.com', 'jane.smith@example.com']
      },
      force: true
    });

    console.log(`✅ Deleted ${deletedMeasurements} measurements`);
    console.log(`✅ Deleted ${deletedUsers} users`);
    console.log('🎉 Test data cleared!');

    return {
      deletedUsers,
      deletedMeasurements
    };

  } catch (error) {
    console.error('❌ Error clearing test data:', error);
    throw error;
  }
};

module.exports = {
  seedTestData,
  clearTestData
};

// If run directly
if (require.main === module) {
  const { testConnection, syncDatabase } = require('../models');
  
  const runSeeder = async () => {
    try {
      await testConnection();
      await syncDatabase();
      
      const command = process.argv[2];
      
      if (command === 'clear') {
        await clearTestData();
      } else {
        await seedTestData();
      }
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeder failed:', error);
      process.exit(1);
    }
  };
  
  runSeeder();
}
