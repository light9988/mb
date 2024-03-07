import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './user.js';

// Assignment model
const Assignment = sequelize.define('Assignment', {
    userId: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 10,
        },
    },
    num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 100,
        },
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true,
    createdAt: 'assignment_created',
    updatedAt: 'assignment_updated'
});

User.hasMany(Assignment, {
    foreignKey: 'userId',
    as: 'assignments',
});

Assignment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users',
});

export default Assignment;