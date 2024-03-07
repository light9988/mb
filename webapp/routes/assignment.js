import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getAllAssignments,  createAssignment, getAssignmentById, updateAssignment, deleteAssignment, submitAssignment } from '../controller/assignment.js';

// Assignment route
const assignmentRouter = express.Router();

assignmentRouter.get('/v3/assignments', verifyToken, getAllAssignments);
assignmentRouter.post('/v3/assignments', verifyToken, createAssignment);
assignmentRouter.get('/v3/assignments/:id', verifyToken, getAssignmentById);
assignmentRouter.put('/v3/assignments/:id', verifyToken, updateAssignment);
assignmentRouter.delete('/v3/assignments/:id', verifyToken, deleteAssignment);
assignmentRouter.post('/v3/assignments/:id/submission', verifyToken, submitAssignment);

export default assignmentRouter;
