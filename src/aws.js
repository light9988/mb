// const AWS = require('aws-sdk');
// const fs = require('fs');


// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });

// export const uploadToS3 = () => {
//     const folderPath = '/mb';
//     const folderContent = fs.readdirSync(folderPath);

//     folderContent.forEach(file => {
//         const filePath = path.join(folderPath, file);
//         const fileContent = fs.readFileSync(filePath);
//         const pathToFolder = process.env.S3_FOLDER_PATH;

//         const params = {
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: `${pathToFolder}/${file}`,
//             Body: fileContent
//         };

//         s3.upload(params, function (err, data) {
//             if (err) {
//                 console.log(`Error uploading file ${file}:`, err);
//             } else {
//                 console.log(`File ${file} uploaded successfully. File location: ${data.Location}`);
//             }
//         });
//     });
// };