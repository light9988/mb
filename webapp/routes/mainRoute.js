import express from 'express';
import assignmentRouter from './routes/assignment.js';
import healthzRouter from './routes/healthz.js';

const mainRouter = express.Router();

mainRouter.use(assignmentRouter);
mainRouter.use(healthzRouter);
// mainRouter.use(userRouter);

export default mainRouter;