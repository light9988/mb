import fastcsv from 'fast-csv';
import fs from 'fs';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

//Function to import CSV data into the User model
async function importCSVData() {
    try {
        // const filepath = './user.csv';
        const filepath = '/opt/user.csv';
        const stream = fs.createReadStream(filepath);
        const csvData = [];
        let isHeaderRow = true;

        const csvStream = fastcsv
            .parse()
            .on('data', (row) => {
                if (isHeaderRow) {
                    isHeaderRow = false;
                    return;
                }
                console.log("Processing row:", row);
                const [firstName, lastName, username, password] = row;
                if (!firstName || !lastName || !username) {
                    console.error("Invalid data:", row);
                    return;
                }
                csvData.push(row);
            })
            .on('end', async () => {
                for (const row of csvData) {
                    const [firstName, lastName, username, password] = row;
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await User.findOne({ where: {username} });

                    if (!user) {
                        await User.create({
                            first_name: firstName,
                            last_name: lastName,
                            username: username,
                            password: hashedPassword,
                        });
                    }
                }
                console.log('CSV data has been imported into the User model.');
            });

        stream.pipe(csvStream);
    } catch (error) {
        console.error('Error importing CSV data:', error);
    }
}

export default importCSVData;