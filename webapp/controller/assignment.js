import User from "../models/user.js";
import Assignment from "../models/assignment.js";
import sequelize from "../config/sequelize.js";
import basicAuth from 'basic-auth';
import Submission from '../models/submission.js';
import sendMessageToSNS from '../service/sns.js';
// import "../service/sns.js";
import dotenv from 'dotenv';
dotenv.config();

// Assignment functions
export const sanitizeAssignment = (assignment) => {
    const { userId, ...sanitizedAssignment } = assignment.toJSON();
    return sanitizedAssignment;
}

// Get assignment list
export const getAllAssignments = async (req, res) => {
    try {
        await sequelize.sync();
        const assignments = await Assignment.findAll();
        const sanitizedAssignments = assignments.map(sanitizeAssignment);
        res.status(200).send(sanitizedAssignments);
        // res.status(200).send(assignments);
    } catch (error) {
        console.error('Failed to get all assignments : ', error);
    }
};

// Create assignment
export const createAssignment = async (req, res) => {
    try {
        const credentials = basicAuth(req);
        const user = await User.findOne({ where: { username: credentials.name } });
        const { name, points, num_of_attempts, deadline } = req.body;

        const newAssignment = await Assignment.create({
            userId: user.id,
            name,
            points,
            num_of_attempts,
            deadline,
        });
        // res.status(201).send(newAssignment);
        // res.status(201).send(sanitizeAssignment(newAssignment));
        const response = {
            id: newAssignment.id,
            name: newAssignment.name,
            points: newAssignment.points,
            num_of_attempts: newAssignment.num_of_attempts,
            deadline: newAssignment.deadline.toISOString(),
            assignment_created: new Date().toISOString(),
            assignment_updated: new Date().toISOString()
        };    
        res.status(201).send(response);
    } catch (error) {
        console.log('Failed to add an assignment: ' + error);
        res.status(400).send();
    }
}

// Get assignment by ID
export const getAssignmentById = async (req, res) => {
    try {
        const credentials = basicAuth(req);
        const user = await User.findOne({ where: { username: credentials.name } });
        if (!user) {
            return res.status(401).send();
        }
        const assignment = await Assignment.findOne({ where: { id: req.params.id } });
        if (!assignment) {
            return res.status(404).send();
        }
        res.status(200).send(assignment);
        // res.status(200).send(sanitizeAssignment(assignment));
        console.log(assignment);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    try {
        const credentials = basicAuth(req);
        const user = await User.findOne({ where: { username: credentials.name } });
        // req.params.id = req.params.id.replace(/[^a-zA-Z0-9\-]/g, '');
        const assignmentId = req.params.id;

        if (!assignmentId) {
            return res.status(400).send();
        }
        const assignment = await Assignment.findOne({ where: { id: assignmentId } });
        if (!assignment) {
            return res.status(404).send();
        }
        if (assignment.userId !== user.id) {
            return res.status(403).send();
        }

        const { name, points, num_of_attempts, deadline } = req.body;
        if (!name || !points || !num_of_attempts || !deadline) {
            return res.status(400).send();
        }
        assignment.name = name;
        assignment.points = points;
        assignment.num_of_attempts = num_of_attempts;
        assignment.deadline = deadline;

        await assignment.save();
        // res.status(200).send(assignment);
        res.status(200).send(sanitizeAssignment(assignment));
    } catch (error) {
        console.error('Failed to update an assignment: ' + error);
        res.status(400).send({ error: 'Failed to update an assignment' });
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    try {
        const credentials = basicAuth(req);
        const user = await User.findOne({ where: { username: credentials.name } });
        // req.params.id = req.params.id.replace(/[^a-zA-Z0-9\-]/g, '');
        const assignmentId = req.params.id;
        const assignment = await Assignment.findOne({ where: { id: assignmentId } });

        if (!assignmentId) {
            return res.status(404).send();
        }
        if (!assignment) {
            return res.status(404).send();
        }
        if (assignment.userId !== user.id) {
            return res.status(403).send();
        }

        await assignment.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete the assignment:', error);
        res.status(400).send();
    }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
    try {   
        const assignmentId = req.params.id;
        const credentials = basicAuth(req);
        const user = await User.findOne({ where: { username: credentials.name } });
        const assignment = await Assignment.findOne({ where: { id: assignmentId } });
        const submission_date = new Date();
        const { submission_url } = req.body;
        const github_url = "https://github.com/tparikh/myrepo/archive/refs/tags/v1.0.0.zip";
        const submissionsCount = await Submission.count({
            where: {
                userId: user.id,
                assignment_id: assignmentId,
            },
        });
        const userEmail = credentials.name;
        const topicArn = process.env.SNS_TOPIC_ARN;
        // const topicArn = "arn:aws:sns:us-west-2:257538979157:snsTopic-e1a524f";

        if (!assignmentId) {
            return res.status(401).send('Assignment ID is required');
        }           
        if (!user) {
            return res.status(401).send('User not found');
        }     
        if (!assignment) {
            return res.status(401).send('Assignment not found');
        }
        if (assignment.userId !== user.id) {
            return res.status(401).send('User is not authorized to submit this assignment');
        }  
        if (submission_date > assignment.deadline ) {
            return res.status(403).send('Assignment deadline has passed');
        }
        if (submissionsCount >= assignment.num_of_attempts) {
            return res.status(403).send('Number of attempts exceeded');
        }
        if (submission_url != github_url) {
            await sendMessageToSNS(submission_url, userEmail, topicArn);
            return res.status(403).send('Submission url is wrong.');
        }
        const submission = await Submission.create({
            userId: user.id,
            assignment_id:assignmentId,
            submission_url,
            submission_date,
        });
        const response = {
            id: submission.id,
            // userId: submission.userId,
            assignment_id: submission.assignment_id,
            submission_url: submission.submission_url,
            submission_date: submission.submission_date.toISOString(),
            assignment_updated: new Date().toISOString()
        };
        res.status(201).send(response);
        await sendMessageToSNS(submission_url, userEmail, topicArn);
    } catch (error) {
        console.error('Failed to submit assignment:', error);
        res.status(400).send();
    }
}