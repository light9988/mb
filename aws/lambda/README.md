# lambda

## Build lambda function:

The Lambda function is responsible for following:
  - Download the release from the GitHub repository and store it in Google Cloud Storage Bucket.
  - Email the user the status of download.
  - Track the emails sent in DynamoDB.
