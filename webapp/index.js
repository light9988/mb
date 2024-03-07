// import express from 'express';
// import { Sequelize, DataTypes } from 'sequelize';
// import bcrypt from 'bcrypt';
// import fastcsv from 'fast-csv';
// import fs from 'fs';
// import 'dotenv/config';
// import bodyParser from 'body-parser';
// import basicAuth from 'basic-auth';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const port = 8080;
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // const { DATABASE_HOSTNAME, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
// // const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
// //     dialect: "mariadb",
// //     host: DATABASE_HOSTNAME,
// // });

// const sequelize = new Sequelize('db', 'dev', 'password', {
//     dialect: "mariadb",
//     host: "127.0.0.1",
//     database: "db",
//     username: "dev",
//     password: "password",
// });

// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
// });

// //User model
//  const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false,
//     },
//     first_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     last_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true
//         }
//     },
// //  }, {
// //     createdAt: 'account_created',
// //     updatedAt: 'account_updated'
// });

// // Assignment model
// const Assignment = sequelize.define('Assignment', {
//     id: {
//         type: DataTypes.UUID,
//         primaryKey: true,
//         allowNull: false,
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     points: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             min: 1,
//             max: 10,
//         },
//     },
//     num_of_attempts: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             min: 1,
//             max: 100,
//         },
//     },
//     deadline: {
//         type: DataTypes.DATE,
//         allowNull: false,
//     },
// //  }, {
// //     createdAt: 'account_created',
// //     updatedAt: 'account_updated'
// });

// // Bootstrap the database at startup
// (async () => {
//     try {
//         await sequelize.sync({force:true});
//         await importCSVData();

//         console.log('Database bootstrapped successfully');
//     } catch (error) {
//         console.error('Database bootstrapping error:', error);
//     }
// })();

// //Function to import CSV data into the User model
// async function importCSVData() {
//     try {
//         // const filepath = './user.csv';
//         const filepath = '/opt/user.csv';
//         const stream = fs.createReadStream(filepath);
//         const csvData = [];
//         let isHeaderRow = true;

//         const csvStream = fastcsv
//             .parse()
//             .on('data', (row) => {
//                 if (isHeaderRow) {
//                     isHeaderRow = false;
//                     return;
//                 }
//                 console.log("Processing row:", row);
//                 const [firstName, lastName, username, password] = row;
//                 if (!firstName || !lastName || !username) {
//                     console.error("Invalid data:", row);
//                     return;
//                 }
//                 csvData.push(row);
//             })
//             .on('end', async () => {
//                 for (const row of csvData) {
//                     const [firstName, lastName, username, password] = row;
//                     const hashedPassword = await bcrypt.hash(password, 10);
//                     const user = await User.findOne({ where: {username} });

//                     if (!user) {
//                         await User.create({
//                             first_name: firstName,
//                             last_name: lastName,
//                             username: username,
//                             password: hashedPassword,
//                         });
//                     }
//                 }
//                 console.log('CSV data has been imported into the User model.');
//             });

//         stream.pipe(csvStream);
//     } catch (error) {
//         console.error('Error importing CSV data:', error);
//     }
// }

// //Basic authentication
// // verify token
// const verifyToken = async (req, res, next) => {
//     try {
//         let token = req.header("Authorization");
//         if (!token) {
//             console.log("No Authorization token provided.");
//             res.set("WWW-Authenticate", "Basic").status(401).send();
//         } else {
//             const credentials = Buffer.from(token.split(" ")[1], "base64").toString().split(":");
//             const username = credentials[0]
//             const password = credentials[1];
//             const user = await User.findOne({ where: { username: username } });
//             let passwordHash, isMatch;
//             console.log("username: " + username);
//             console.log("password: " + password);
//             if (user) {
//                 passwordHash = user.password;
//                 isMatch = await bcrypt.compare(password, passwordHash);
//             }
//             if (!isMatch || !user) {
//                 res.set("WWW-Authenticate", "Basic").status(401).json();
//             } else {
//                 next();
//                 console.log("User is authorized to access this route.");
//             }
//         }
//     } catch (error) {
//         return res.status(400).send();
//     }
// }

// // Routes
// // Assignment functions
// // Get assignment list
// const getAllAssignments = async (req, res) => {
//     try {
//         await sequelize.sync();
//         const assignments = await Assignment.findAll();
//         res.status(200).send(assignments);
//     } catch (error) {
//         console.error('Failed to get all assignments : ', error);
//     }
// };

// // Create assignment
// const createAssignment = async (req, res) => {
//     try {
//         const credentials = basicAuth(req);
//         const user = await User.findOne({ where: { username: credentials.name } });
//         const { name, points, num_of_attempts, deadline } = req.body;

//         const newAssignment = await Assignment.create({
//             id: user.id,
//             name,
//             points,
//             num_of_attempts,
//             deadline,
//         });
//         res.status(201).send(newAssignment);
//     } catch (error) {
//         console.log('Failed to add an assignment: ' + error);
//         res.status(400).send();
//     }
// }

// // Get assignment detail
// const getAssignmentById = async (req, res) => {
//     try {
//         const credentials = basicAuth(req);
//         const user = await User.findOne({ where: { username: credentials.name } });
//         const id = user.id;

//         if (!user) {
//             return res.status(401).send();
//         }
//         req.params.id = req.params.id.replace(/[^a-zA-Z0-9\-]/g, '');
//         if (req.params.id && user.id !== req.params.id) {
//             console.log("ID doesn't match. User is not authorized to access this route.");
//             return res.status(403).send();
//         }
//         const assignments = await Assignment.findAll({ where: { id: user.id } });
//         res.status(200).send(assignments);
//         console.log(assignments);
//     } catch (error) {
//         console.error(error);
//         res.status(400).send();
//     }
// };

// // Update assignment
// const updateAssignment = async (req, res) => {
//     try {
//         const credentials = basicAuth(req);
//         const user = await User.findOne({ where: { username: credentials.name } });
//         req.params.id = req.params.id.replace(/[^a-zA-Z0-9\-]/g, '');
//         const assignmentId = req.params.id;

//         if (!assignmentId || !user.id) {
//             return res.status(400).send();
//         }
//         if (assignmentId !== user.id) {
//             return res.status(403).send();
//         }

//         const { name, points, num_of_attempts, deadline } = req.body;
//         if (!name || !points || !num_of_attempts || !deadline) {
//             return res.status(400).send();
//         }

//         const existingAssignment = await Assignment.findOne({ where: { id: assignmentId } });

//         if (!existingAssignment) {
//             return res.status(404).send();
//         }
//         existingAssignment.name = name;
//         existingAssignment.points = points;
//         existingAssignment.num_of_attempts = num_of_attempts;
//         existingAssignment.deadline = deadline;

//         await existingAssignment.save();

//         res.status(200).send(existingAssignment);
//     } catch (error) {
//         console.error('Failed to update an assignment: ' + error);
//         res.status(400).send({ error: 'Failed to update an assignment' });
//     }
// }

// // Delete assignment
// const deleteAssignment = async (req, res) => {
//     try {
//         const credentials = basicAuth(req);
//         const user = await User.findOne({ where: { username: credentials.name } });

//         if (!user) {
//             return res.status(401).send({ error: 'Unauthorized' });
//         }

//         req.params.id = req.params.id.replace(/[^a-zA-Z0-9\-]/g, '');
//         const assignmentId = req.params.id;

//         const assignment = await Assignment.findOne({ where: { id: assignmentId } });

//         if (!assignment || assignmentId !== user.id) {
//             return res.status(403).send();
//         }

//         await assignment.destroy();
//         res.status(204).send();
//     } catch (error) {
//         console.error('Failed to delete the assignment:', error);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// }

// app.get('/v1/assignments', verifyToken, getAllAssignments);
// app.post('/v1/assignments', verifyToken, createAssignment);
// app.get('/v1/assignments/:id', verifyToken, getAssignmentById);
// app.put('/v1/assignments/:id', verifyToken, updateAssignment);
// app.delete('/v1/assignments/:id', verifyToken, deleteAssignment);

// app.patch('/v1/assignments/:id', (req, res) => {
//     res.status(405).send();
// });

// // Healthz route
// const headers = {
//     'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
//     'Pragma': 'no-cache',
//     'Expires': '0',
//     'Surrogate-Control': 'no-store',
//     'Content-Type': 'application/json'
// };

// app.get('/healthz', async (req, res) => {
//     try {
//         await sequelize.authenticate();
//         res.set(headers);
//         res.status(200).send();
//     } catch (error) {
//         console.error('Error:', error);
//         res.set(headers);
//         res.status(503).send();
//     }
// });

// const methods = ['post', 'put', 'delete', 'patch'];
// methods.forEach((method) => {
//     app[method]('/healthz', methodNotAllowedHandler);
// });
// function methodNotAllowedHandler(req, res) {
//     res.set(headers);
//     res.status(405).send();
// }

// // Start the server and listen on the specified port and host
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server is running on port ${port}`);
// });

