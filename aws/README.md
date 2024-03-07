# aws

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Software/SDKs:**
  - [Python](https://www.python.org/downloads/)
  - [AWS CLI](https://aws.amazon.com/cli/) 
  - [Pulumi](https://www.pulumi.com/docs/clouds/aws/get-started/begin/) 
  - [gcloud CLI](https://cloud.google.com/cli)

- **Accounts/Services:**
  - [AWS account](https://aws.amazon.com/) 
  - [Google Cloud account](https://console.cloud.google.com/)

- **Environment Variables/Configuration:**
  - AWS Access and Secret Keys 
  - AWS profile config
  - Pulumi stack config
  - Google cloud profile config

## Build and Deploy Instructions

### Local Development

1. **Clone the repository:**

   git clone [repository_url]
   cd [repository_name]

2. **Install dependencies:**

   pip install -r requirements.txt

### Deployment

1. **Set up AWS Credentials** :
   Ensure that you have set up your AWS credentials either via the `aws configure` command or by setting environment variables.

2. **Set up DNS**

3. **Import SSl certificate into AWS Certificate Manager** :

   cd to path of SSL certificate file

   Import SSL to AWS CM with below commands:
   aws acm import-certificate --certificate fileb://Certificate.pem \
      --certificate-chain fileb://CertificateChain.pem \
      --private-key fileb://PrivateKey.pem \
      --region us-west-2 \
      --profile demo 	

4. **Infrastructure Setup with Pulumi** :
   Navigate to your infrastructure directory and run:

   pulumi up

5. ** Destroy**

   pulumi destroy
