import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './user.js';
import Assignment from './assignment.js';

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        primaryKey: true
    },
    assignment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Assignments',
            key: 'id'
        },
        primaryKey: true
    },
    submission_url: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true, 
});

export default Submission;
