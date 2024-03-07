import express from 'express';
import sequelize from '../config/sequelize.js';

// Healthz route to check database connection
const healthzRouter = express.Router();

const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'Content-Type': 'application/json'
};

healthzRouter.get('/healthz', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.set(headers);
        res.status(200).send();
    } catch (error) {
        console.error('Error:', error);
        res.set(headers);
        res.status(503).send();
    }
});

const methods = ['post', 'put', 'delete', 'patch'];
methods.forEach((method) => {
    healthzRouter[method]('/healthz', methodNotAllowedHandler);
});
function methodNotAllowedHandler(req, res) {
    res.set(headers);
    res.status(405).send();
}

export default healthzRouter;