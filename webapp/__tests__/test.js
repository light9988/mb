import request from "supertest";
import express from "express";
import healthzRouter from "../routes/healthz.js";
import sequelize from "../config/sequelize.js";

const app = express();
app.use(healthzRouter);

test('/healthz endpoint should return 200', async () => {
    const response = await request(app).get('/healthz');
    expect(response.statusCode).toBe(200);
});

afterAll(async () => {
    await sequelize.close();
});
