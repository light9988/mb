import express from 'express';
import sequelize from './config/sequelize.js';
import importCSVData from './config/importCSVData.js';
import assignmentRoutes from './routes/assignment.js';
import healthzRoutes from './routes/healthz.js';
import logger from './config/logger.js';
import statsdClient from './config/statsd.js';
// import mainRouter from './routes/mainRouter';

const app = express();
export const apiCounters = {};

// Middleware to count route hits
app.use((req, res, next) => {
    const route = req.path.replace(/\//g, '_').toLowerCase();
    const method = req.method.toLowerCase();
    const metricName = `endpoint_${method}${route}_hits`;

    if (!apiCounters[metricName]) {
        apiCounters[metricName] = 1;
    } else {
        apiCounters[metricName]++;
    }

    statsdClient.increment(metricName);
    logger.info(`Incremented metric ${metricName}`);
    next();
});

app.use(express.json());

app.use(healthzRoutes);

// Bootstrap the database at startup
(async () => {
    try {
        await sequelize.sync({ force: true });
        await importCSVData();
        console.log('Database bootstrapped successfully');
    } catch (error) {
        console.error('Database bootstrapping error:', error);
    }
})();

app.use(assignmentRoutes);
// app.use(mainRouter);

app.get('/', (req, res) => {
    // statsdClient.increment("root_route_hits"); 
    // logger.info('Root route hit');
    res.status(200).send();
});

// app.get('/counts', (req, res) => {
//     res.status(200).json(apiCounters);
// });

export default app;
