'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WeightMeasurements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Weight in kg or lbs'
      },
      unit: {
        type: Sequelize.ENUM('kg', 'lbs'),
        allowNull: false,
        defaultValue: 'kg'
      },
      bmi: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
        comment: 'Calculated BMI'
      },
      bodyFat: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
        comment: 'Body fat percentage'
      },
      muscleMass: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Muscle mass in kg'
      },
      boneMass: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
        comment: 'Bone mass in kg'
      },
      waterPercentage: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
        comment: 'Water percentage'
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('WeightMeasurements', ['userId', 'timestamp'], {
      name: 'idx_user_timestamp'
    });

    await queryInterface.addIndex('WeightMeasurements', ['userId', 'createdAt'], {
      name: 'idx_user_created'
    });

    await queryInterface.addIndex('WeightMeasurements', ['timestamp'], {
      name: 'idx_timestamp'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WeightMeasurements');
  }
};
