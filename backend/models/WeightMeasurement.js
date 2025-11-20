const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
const WeightMeasurement = sequelize.define('WeightMeasurement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: {
        args: 10,
        msg: 'Weight must be at least 10 kg'
      },
      max: {
        args: 300,
        msg: 'Weight cannot exceed 300 kg'
      },
      isDecimal: {
        msg: 'Weight must be a valid number'
      }
    },
    comment: 'Weight in kg'
  },
  unit: {
    type: DataTypes.ENUM('kg', 'lbs'),
    allowNull: false,
    defaultValue: 'kg',
    validate: {
      isIn: {
        args: [['kg', 'lbs']],
        msg: 'Unit must be either kg or lbs'
      }
    }
  },
  bmi: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: {
        args: 10,
        msg: 'BMI must be at least 10'
      },
      max: {
        args: 50,
        msg: 'BMI cannot exceed 50'
      }
    },
    comment: 'Calculated BMI'
  },
  bodyFat: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0,
        msg: 'Body fat percentage cannot be negative'
      },
      max: {
        args: 50,
        msg: 'Body fat percentage cannot exceed 50%'
      }
    },
    comment: 'Body fat percentage'
  },
  muscleMass: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0,
        msg: 'Muscle mass cannot be negative'
      },
      max: {
        args: 100,
        msg: 'Muscle mass cannot exceed 100 kg'
      }
    },
    comment: 'Muscle mass in kg'
  },
  boneMass: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0,
        msg: 'Bone mass cannot be negative'
      },
      max: {
        args: 10,
        msg: 'Bone mass cannot exceed 10 kg'
      }
    },
    comment: 'Bone mass in kg'
  },
  waterPercentage: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0,
        msg: 'Water percentage cannot be negative'
      },
      max: {
        args: 100,
        msg: 'Water percentage cannot exceed 100%'
      }
    },
    comment: 'Water percentage'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        msg: 'Please provide a valid timestamp'
      }
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Notes cannot exceed 1000 characters'
      }
    }
  }
}, {
  tableName: 'WeightMeasurements',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'timestamp'],
      name: 'idx_user_timestamp'
    },
    {
      fields: ['userId', 'createdAt'],
      name: 'idx_user_created'
    }
  ],
  hooks: {
    beforeCreate: async (measurement, options) => {
      // Calculate BMI if user height is available
      if (measurement.userId && !measurement.bmi) {
        try {
          const User = require('./User');
          const user = await User.findByPk(measurement.userId);
          if (user && user.height) {
            let weightInKg = measurement.weight;
            
            // Convert weight to kg if it's in lbs
            if (measurement.unit === 'lbs') {
              weightInKg = measurement.weight / 2.20462;
            }
            
            // Calculate BMI: weight(kg) / height(m)^2
            const bmi = weightInKg / (user.height * user.height);
            measurement.bmi = Math.round(bmi * 100) / 100; // Round to 2 decimal places
          }
        } catch (error) {
          console.error('Error calculating BMI:', error);
        }
      }
    },
    beforeUpdate: async (measurement, options) => {
      // Recalculate BMI if weight or unit changed
      if (measurement.changed('weight') || measurement.changed('unit')) {
        try {
          const User = require('./User');
          const user = await User.findByPk(measurement.userId);
          if (user && user.height) {
            let weightInKg = measurement.weight;
            
            // Convert weight to kg if it's in lbs
            if (measurement.unit === 'lbs') {
              weightInKg = measurement.weight / 2.20462;
            }
            
            // Calculate BMI: weight(kg) / height(m)^2
            const bmi = weightInKg / (user.height * user.height);
            measurement.bmi = Math.round(bmi * 100) / 100; // Round to 2 decimal places
          }
        } catch (error) {
          console.error('Error recalculating BMI:', error);
        }
      }
    }
  }
});

// Instance method to convert weight to different units
WeightMeasurement.prototype.convertWeight = function(targetUnit) {
  if (this.unit === targetUnit) {
    return this.weight;
  }
  
  if (this.unit === 'kg' && targetUnit === 'lbs') {
    return Math.round(this.weight * 2.20462 * 100) / 100;
  }
  
  if (this.unit === 'lbs' && targetUnit === 'kg') {
    return Math.round(this.weight / 2.20462 * 100) / 100;
  }
  
  return this.weight;
};

return WeightMeasurement;
};
