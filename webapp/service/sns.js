import AWS from 'aws-sdk';
import { appendFile } from 'fs/promises';

AWS.config.update({ region: 'us-west-2' }); 
// // For local run
// const credentials = new AWS.SharedIniFileCredentials({profile: 'demo'});
// AWS.config.credentials = credentials;

// Create an SNS service object
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

const sendMessageToSNS = async (submission_url, userEmail, topicArn) => {
    const params = {
        Message: `URL: ${submission_url}, User Email: ${userEmail}`, 
        TopicArn: topicArn
    };

    try {
        const publishTextPromise = await sns.publish(params).promise();
        const logMessage = `Message sent to the topic ${params.TopicArn}\nMessageID is ${publishTextPromise.MessageId}`;
        console.log(logMessage);
        await appendFile("./logs/app.log", logMessage);
        console.log('Log message written to file.');     
    } catch (err) {
        const errorMessage = `Error publishing message to SNS topic ${params.TopicArn}: ${err.message}`;
        console.error(errorMessage, err.stack);
        await appendFile("./logs/app.log", errorMessage);
    }
};
    
export default sendMessageToSNS;
