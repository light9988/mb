// import express from 'express';
// import User from '../models/user.js';

// // User route to populate database
// const userRouter = express.Router();

// userRouter.post('/users', async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// export default userRouter;