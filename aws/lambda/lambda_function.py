import requests
from urllib.parse import urlparse
import boto3
import os
import json
from datetime import datetime
from google.oauth2 import service_account
from google.cloud import storage
from email.mime.text import MIMEText
from botocore.exceptions import ClientError


ses_sender_email = os.getenv("SES_SENDER_EMAIL")
dynamodb_table_name = os.getenv("DYNAMODB_TABLE_NAME")
google_project = os.getenv("GOOGLE_PROJECT")
google_bucket_name = os.getenv("BUCKET_NAME")
github_url = os.getenv("GITHUB_URL")
region = os.getenv("REGION_NAME")
# service_account_info =  os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
# credentials = service_account.Credentials.from_service_account_info(service_account_info)
service_account_key_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
if service_account_key_json:
    service_account_info = json.loads(service_account_key_json)
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info
    )
else:
    print("GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set or invalid")

def parse_sns_message(sns_message):
    parts = sns_message.split(", ")
    url_part = parts[0] if len(parts) > 0 else ""
    email_part = parts[1] if len(parts) > 1 else ""

    submission_url = url_part.replace("URL: ", "").strip()
    user_email = email_part.replace("User Email: ", "").strip()
    user_name = user_email.split("@")[0].replace(".", "_")

    print(f"github_url: {github_url}")
    print(f"submission_url: {submission_url}")
    print(f"user_email: {user_email}")
    print(f"user_name: {user_name}")

    return submission_url, user_email, user_name

def get_file_name_from_url(submission_url):
    parsed_url = urlparse(submission_url)
    return os.path.basename(parsed_url.path)

def download_file(submission_url):
    try:
        response = requests.get(submission_url)
        response.raise_for_status()  
        return response.content, True  
    except requests.exceptions.RequestException as e:
        return str(e), False  

def upload_to_gcs(google_bucket_name, user_name, file_name, file_data):
    storage_client = storage.Client(credentials=credentials)

    base_file_name, file_extension = os.path.splitext(file_name)
    base_blob_name = f"{user_name}_{base_file_name}"
    blob_name = f"{base_blob_name}{file_extension}"

    bucket = storage_client.bucket(google_bucket_name)

    counter = 1
    while bucket.blob(blob_name).exists():
        print(f"File named {blob_name} already exists. Trying a new name.")
        blob_name = f"{base_blob_name}-{counter}{file_extension}"
        counter += 1

    print(f"Uploading file as {blob_name}")
    blob = bucket.blob(blob_name)
    blob.upload_from_string(file_data)
    print("Upload complete.")
    # Construct the GCS URL
    # gcs_url = f"https://storage.cloud.google.com/{google_bucket_name}/{blob_name}?authuser=1"
    gcs_url = f"https://storage.cloud.google.com/{google_bucket_name}/{blob_name}"
    return gcs_url

def send_email(user_email, subject, body):
    try:
        ses_client = boto3.client("ses", region_name=region)
        response = ses_client.send_email(
            Source=ses_sender_email,
            Destination={"ToAddresses": [user_email]},
            Message={"Subject": {"Data": subject}, "Body": {"Text": {"Data": body}}},
        )
        print(f"sender_email: {ses_sender_email}")
        print(response)
        return {
            "statuscode": 200,
            "body": json.dumps({
                "message": "Email Sent Successfully.",
                "messageId": response["MessageId"],
                "subject": subject,
                "body": body
            }),
        }
    except Exception as e:
        print(f"Error sending email: {e}")
        return {
            "statuscode": 400,
            "body": "Failed to send email. Error: " + str(e)
        }

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(dynamodb_table_name)

def log_email_sent(user_email, email_status):
    try:
        current_time = datetime.now()
        timestamp = current_time.isoformat()

        table.put_item(
            Item={
                "email": user_email,
                "timestamp": timestamp,  
                "Type": "EmailLog",
                "status": email_status,
                "dateTime": str(current_time),
            }
        )
        print(f"Logged email status: {email_status}")
    except Exception as e:
        print(f"Error logging email status: {e}")

def lambda_handler(event, context):
    print(f"Received event: {event}")
    if "Records" not in event or not event["Records"]:
        print("No records in the event")
        return
    try:
        sns_message = event["Records"][0]["Sns"]["Message"]
        # pprint.pprint(sns_message)
        submission_url, user_email, user_name = parse_sns_message(sns_message)
        file_data, download_success = download_file(submission_url)

        # Check if submission_url is correct, if wrong, send email
        if submission_url != github_url:
            subject = "Incorrect Submission URL"
            body = (
                f"Submission URL is wrong."
            )
            email_status = send_email(user_email, subject, body)
            log_email_sent(user_email, email_status)
            return

        # If submission_url is correct, upload file, send email, log email
        if download_success:
            file_name = get_file_name_from_url(submission_url)
            gcs_url = upload_to_gcs(google_bucket_name, user_name, file_name, file_data)
            subject = "Submit Status"
            body = (
                f"Your file has been successfully submitted to: {gcs_url}"
            )
        else:
            # Handle the case where download is not successful
            subject = "Submit Failed"
            body = f"Failed to download file. Error: {file_data}"

        email_status = send_email(user_email, subject, body)
        log_email_sent(user_email, email_status)

    except KeyError as e:
        print(f"Key error occurred: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

