const { sequelize } = require('../config/database');

// Initialize models
const User = require('./User')(sequelize);
const WeightMeasurement = require('./WeightMeasurement')(sequelize);

// Define associations
User.hasMany(WeightMeasurement, {
  foreignKey: 'userId',
  as: 'measurements',
  onDelete: 'CASCADE'
});

WeightMeasurement.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Sync database (only in development)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  WeightMeasurement,
  syncDatabase
};
