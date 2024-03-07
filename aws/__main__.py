import pulumi
import pulumi_aws as aws
import ipaddress
import math
from pulumi import Output
from datetime import datetime
from pulumi_aws import ec2, route53
import base64
from pulumi_aws.lambda_.function import Function
from pulumi import RemoteArchive
import pulumi_gcp as gcp
from pulumi_gcp import storage, serviceaccount, projects
import os
import json

# Load the Pulumi config
config = pulumi.Config()

# Create gcp resources
bucket_name = config.require("googleBucketName")

# # Create GCP Storage Bucket
# bucket = storage.Bucket(
#     'bucket-demo',
#     location="us-west1"
#     )
# pulumi.export('bucket_name', bucket.url)

# Create Google Service Account
service_account = gcp.serviceaccount.Account(
    "light999", account_id="light999", display_name="light999"
)

service_account_id = service_account.account_id.apply(
    lambda v: f"Service Account ID: {v}"
)
pulumi.export("service_account_id", service_account_id)

iam_role_binding = gcp.serviceaccount.IAMBinding(
    "iam-role-binding",
    service_account_id=service_account.name.apply(lambda name: name),
    role="roles/iam.serviceAccountUser",
    members=[service_account.email.apply(lambda email: f"serviceAccount:{email}")],
)

bucket_object_creator_binding = service_account.email.apply(
    lambda email: gcp.storage.BucketIAMBinding(
        "bucket-object-creator-binding",
        bucket=bucket_name,
        role="roles/storage.objectUser",
        members=[service_account.email.apply(lambda email: f"serviceAccount:{email}")],
    )
)

# Create Access Key
service_account_key = gcp.serviceaccount.Key(
    "service-account-key",
    service_account_id=service_account.name,
    public_key_type="TYPE_X509_PEM_FILE",
)

pulumi.export("service_account_key", service_account_key.private_key)

# Export Access Key json file
current_file_path = os.path.dirname(os.path.abspath(__file__))
exported_file_path = os.path.join(current_file_path, "service-account-key.json")


def write_key_to_file(key):
    if key:
        decoded_key = base64.b64decode(key).decode("utf-8")
        try:
            json_key = json.loads(decoded_key)
            with open(exported_file_path, "w") as key_file:
                json.dump(json_key, key_file, indent=4)
        except json.JSONDecodeError:
            print("Failed to decode JSON key")


service_account_key.private_key.apply(write_key_to_file)

# pulumi.export("service_account_key_file_path", exported_file_path)




# Create AWS resources
# Create a VPC
vpc = aws.ec2.Vpc(
    "my-vpc",
    cidr_block=config.require("vpcCIDR"),
    enable_dns_support=True,
    enable_dns_hostnames=True,
    tags={
        "Name": "vpc-demo",
    },
)

# Create an Internet Gateway and attach it to the VPC
igw = aws.ec2.InternetGateway(
    "igw",
    vpc_id=vpc.id,
    tags={
        "Name": "igw-demo",
    },
)

# Create a public and a private route table
public_rt = aws.ec2.RouteTable(
    "public-rt",
    vpc_id=vpc.id,
    tags={
        "Name": "rt-public-demo",
    },
)

# Add a route to the public route table pointing to the Internet Gateway
aws.ec2.Route(
    "public-route",
    route_table_id=public_rt.id,
    destination_cidr_block="0.0.0.0/0",
    gateway_id=igw.id,
)

private_rt = aws.ec2.RouteTable(
    "private-rt",
    vpc_id=vpc.id,
    tags={
        "Name": "rt-private-demo",
    },
)

# Create public and private subnets in different availability zones
# Fetching available AZs
azs = aws.get_availability_zones().names
num_azs = len(azs)

# Determine the number of public and private subnets to create
num_azs = min(3, num_azs)

# CIDR Calculation
base_vpc_cidr = config.require("vpcCIDR")
ipi = ipaddress.ip_interface(base_vpc_cidr)
base_cidr = int(str(ipi.network).split("/")[1])
cidr_add = math.ceil(math.sqrt(num_azs * 2))

base_ip = ipaddress.IPv4Network(base_vpc_cidr)
subnets = list(base_ip.subnets(new_prefix=base_cidr + cidr_add))
subnet_cidr = [str(subnet) for subnet in subnets]
# print("All subnet CIDR blocks: ", subnet_cidr)

# Creating public and private subnets
public_subnets = []
private_subnets = []

for i, az in enumerate(azs):
    if i < num_azs:
        public_subnets.append(
            aws.ec2.Subnet(
                f"public-subnet-{i+1}",
                vpc_id=vpc.id,
                cidr_block=subnet_cidr[i],
                availability_zone=az,
                map_public_ip_on_launch=True,
                tags={"Name": f"public_subnet_{str(i+1)}"},
            )
        )
        private_subnets.append(
            aws.ec2.Subnet(
                f"private-subnet-{str(i+1)}",
                vpc_id=vpc.id,
                cidr_block=subnet_cidr[i + num_azs],
                availability_zone=az,
                tags={"Name": f"private_subnet_{str(i+1)}"},
            )
        )

# Associate the public and private subnets with their respective route tables
for idx, subnet in enumerate(public_subnets):
    aws.ec2.RouteTableAssociation(
        f"public-association-{idx}", subnet_id=subnet.id, route_table_id=public_rt.id
    )

for idx, subnet in enumerate(private_subnets):
    aws.ec2.RouteTableAssociation(
        f"private-association-{idx}", subnet_id=subnet.id, route_table_id=private_rt.id
    )

# Create a load balancer security group
ports = [80, 443]

lb_security_group = aws.ec2.SecurityGroup(
    "loadBlancer-security-group",
    description="Load Balancer Security Group",
    vpc_id=vpc.id,
    # ingress=[
    #     aws.ec2.SecurityGroupIngressArgs(
    #         description="Load Balancer Security Group",
    #         protocol="tcp",
    #         from_port=port,
    #         to_port=port,
    #         cidr_blocks=["0.0.0.0/0"],
    #     )
    #     for port in ports
    # ],
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            description="Allow HTTP",
            protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_blocks=["0.0.0.0/0"],
        ),
        aws.ec2.SecurityGroupIngressArgs(
            description="Allow HTTPS",
            protocol="tcp",
            from_port=443,
            to_port=443,
            cidr_blocks=["0.0.0.0/0"],
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            from_port=0,
            to_port=0,
            protocol="-1",
            cidr_blocks=["0.0.0.0/0"],
        )
    ],
    tags={
        "Name": "loadBlancer-security-group",
    },
)

# Create application security group
# ports = [22, 80, 443, 8080]

application_security_group = aws.ec2.SecurityGroup(
    "application-security-group",
    description="Application Security Group",
    vpc_id=vpc.id,
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            description="SSH Access",
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=["0.0.0.0/0"],
        ),
        aws.ec2.SecurityGroupIngressArgs(
            description="Web Traffic from Load Balancer",
            protocol="tcp",
            from_port=8080,
            to_port=8080,
            security_groups=[lb_security_group.id],
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            from_port=0,
            to_port=0,
            protocol="-1",
            cidr_blocks=["0.0.0.0/0"],
        )
    ],
    tags={
        "Name": "application-security-group",
    },
)

# Create a Database security group
db_security_group = aws.ec2.SecurityGroup(
    "database-security-group",
    description="Database Security Group",
    vpc_id=vpc.id,
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            description="MariaDB Database Security Group",
            protocol="tcp",
            from_port=3306,
            to_port=3306,
            security_groups=[application_security_group.id],
        )
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            from_port=0,
            to_port=0,
            protocol="-1",
            cidr_blocks=["0.0.0.0/0"],
        )
    ],
    tags={
        "Name": "database-security-group",
    },
)

# Create a DB Parameter Group
db_parameter_group = aws.rds.ParameterGroup(
    "db-parameter-group",
    family="mariadb10.11",
    description="Custom DB parameter group",
    parameters=[],
)

# Create RDS Instance
# Create db subnet group
db_subnet_group = aws.rds.SubnetGroup(
    "db-subnet-group",
    subnet_ids=[subnet.id for subnet in private_subnets],
    tags={"Name": "db-subnet-group"},
)

# Create RDS Instance
rds_instance = aws.rds.Instance(
    "csye6225",
    parameter_group_name=db_parameter_group.name,
    engine="mariadb",
    engine_version="10.11.5",
    identifier=config.require("rds_db_identifier"),
    db_name=config.require("rds_db_name"),
    username=config.require("rds_db_username"),
    password=config.require("rds_db_password"),
    instance_class="db.t3.micro",
    allocated_storage=20,
    storage_type="gp2",
    vpc_security_group_ids=[db_security_group.id],
    db_subnet_group_name=db_subnet_group.name,
    multi_az=False,
    skip_final_snapshot=True,
    publicly_accessible=False,
    tags={
        "Name": "RDS-instance-demo",
    },
)

# Create IAM role to attach to ec2 instance
existing_cloudwatch_policy_arn = config.require("cloudWatchAgentServerPolicy_arn")
exisiting_sns_full_access_policy_arn = config.require("sns_full_access_policy_arn")

ec2_role = aws.iam.Role(
    "ec2Role",
    assume_role_policy={
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "ec2.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    },
)

# Attach the CloudWatch policy to the role
role_policy_attachment_cloudwatch = aws.iam.RolePolicyAttachment(
    "rolePolicyAttachmentCloudWatch",
    role=ec2_role.name,
    policy_arn=existing_cloudwatch_policy_arn,
)

# # Attach the SNS full access policy to the role
# role_policy_attachment_sns = aws.iam.RolePolicyAttachment(
#     "rolePolicyAttachmentSNS",
#     role=ec2_role.name,
#     policy_arn=exisiting_sns_full_access_policy_arn,
# )

# Create an IAM policy for SNS Publish
sns_publish_policy = aws.iam.Policy(
    "ec2snsPublishPolicy",
    description="Allow SNS Publish",
    policy={
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "sns:Publish",
                "Resource": "*",
            },
        ],
    },
)

# Attach the policy to the IAM role
sns_publish_policy_attachment = aws.iam.RolePolicyAttachment(
    "ec2snsPublishPolicyAttachment",
    role=ec2_role.name,
    policy_arn=sns_publish_policy.arn,
)

# Create an IAM policy for S3 bucket
s3_bucket_policy = aws.iam.Policy(
    "s3BucketPolicy",
    description="Allow S3 Bucket Access",
    policy={
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:*",
                "Resource": "*",
            },
        ],
    },
)

# Attach the policy to the IAM role
s3_bucket_policy_attachment = aws.iam.RolePolicyAttachment(
    "s3BucketPolicyAttachment",
    role=ec2_role.name,
    policy_arn=s3_bucket_policy.arn,
)

# Create IAM instance profile
ec2_instance_profile = aws.iam.InstanceProfile("ec2InstanceProfile", role=ec2_role.name)

# Create SNS Topic
sns_topic = aws.sns.Topic("snsTopic")

pulumi.export("sns_topic_arn", sns_topic.arn)

# Create an SQS queue
queue = aws.sqs.Queue("Queue")
pulumi.export("Queue", queue.name)

# Subscribe the SQS queue to the SNS topic
sqs_sns = aws.sns.TopicSubscription(
    "sqsSubscription", protocol="sqs", topic=sns_topic.arn, endpoint=queue.arn
)

# Create an IAM role for SQS
sqs_role = aws.iam.Role(
    "sqsRole",
    assume_role_policy="""{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "sns.amazonaws.com"
                },
                "Action": "sts:AssumeRole"
            }
        ]
    }""",
)

# Attach the AmazonSQSFullAccess policy to the role
exisiting_sqs_full_access_policy_arn = config.require("sqs_full_access_policy_arn")
sqs_role_policy_attachment = aws.iam.RolePolicyAttachment(
    "sqsRolePolicyAttachment",
    policy_arn=exisiting_sqs_full_access_policy_arn,
    role=sqs_role.name,
)

# Create S3 bucket
aws_s3_bucket = aws.s3.Bucket(
    "s3_bucket",
    acl="private",
    tags={
        "Environment": "Dev",
        "Name": "Bucket-demo",
    },
)

# Create BucketPublicAccessBlock
aws_s3_bucket_public_access_block = aws.s3.BucketPublicAccessBlock(
    "BucketPublicAccessBlock",
    bucket=aws_s3_bucket.id,
    block_public_acls=True,
    block_public_policy=True,
    ignore_public_acls=True,
    restrict_public_buckets=True,
)

# Create BucketServerSideEncryptionConfigurationV2
mykey = aws.kms.Key(
    "mykey",
    description="This key is used to encrypt bucket objects",
    deletion_window_in_days=10,
)

aws_s3_bucket_server_side_encryption_configuration = aws.s3.BucketServerSideEncryptionConfigurationV2(
    "BucketServerSideEncryptionConfigurationV2",
    bucket=aws_s3_bucket.id,
    rules=[
        aws.s3.BucketServerSideEncryptionConfigurationV2RuleArgs(
            apply_server_side_encryption_by_default=aws.s3.BucketServerSideEncryptionConfigurationV2RuleApplyServerSideEncryptionByDefaultArgs(
                kms_master_key_id=mykey.arn,
                sse_algorithm="aws:kms",
            ),
        )
    ],
)

# Create BucketLifecycleConfigurationV2
aws_s3_bucket_lifecycle_configuration = aws.s3.BucketLifecycleConfigurationV2(
    "BucketLifecycleConfigurationV2",
    bucket=aws_s3_bucket["s3_bucket"]["id"],
    rules=[
        aws.s3.BucketLifecycleConfigurationV2RuleArgs(
            id="s3_bucket",
            status="Enabled",
            transition=[
                aws.s3.BucketLifecycleConfigurationV2RuleTransitionArgs(
                    days=30, 
                    storage_class="STANDARD"
                )
            ],
        )
    ],
)

# Launch template
custom_ami_id = config.require("customAmiId")
key_pair_name = config.require("keyPairName")

# User data
# Define database configuration values
database_name = rds_instance.db_name
database_username = rds_instance.username
database_password = rds_instance.password
database_hostname = config.require("rds_instance_endpoint")
sns_topic_arn = sns_topic.arn
aws_s3_bucket_name = aws_s3_bucket.s3_bucket.bucket
aws_s3_bucket_region = vpc.region

all_info = pulumi.Output.all(
    database_name,
    database_username,
    database_password,
    database_hostname,
    sns_topic_arn,
    aws_s3_bucket_name,
    aws_s3_bucket_region
)


def render_user_data(args):
    name, username, password, hostname, topicArn, s3bucketname, s3bucketregion = args
    env_file = "/opt/webapp/.env"
    user_data_script = f"""#!/bin/bash
        # set up env file
        echo 'DATABASE_DIALECT=mariadb' | sudo tee {env_file}
        echo 'DATABASE_NAME={name}' | sudo tee -a {env_file}
        echo 'DATABASE_USERNAME={username}' | sudo tee -a {env_file}
        echo 'DATABASE_PASSWORD={password}' | sudo tee -a {env_file}
        echo 'DATABASE_HOSTNAME={hostname}' | sudo tee -a {env_file}
        echo 'SNS_TOPIC_ARN={topicArn}' | sudo tee -a {env_file}
        echo 'AWS_S3_BUCKET_NAME={s3bucketname}' | sudo tee -a {env_file}
        echo 'AWS_S3_BUCKET_REGION={s3bucketregion}' | sudo tee -a {env_file}

        # config cloudwatch agent
        sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s
    """
    return base64.b64encode(user_data_script.encode("utf-8")).decode("utf-8")


user_data = all_info.apply(render_user_data)

launch_template = aws.ec2.LaunchTemplate(
    "mb_asg",
    image_id=custom_ami_id,
    instance_type="t2.micro",
    key_name=key_pair_name,
    # subnet_id=public_subnets[0].id,
    # vpc_security_group_ids=[application_security_group.id],
    block_device_mappings=[
        aws.ec2.LaunchTemplateBlockDeviceMappingArgs(
            device_name="/dev/xvda",
            ebs=aws.ec2.LaunchTemplateBlockDeviceMappingEbsArgs(
                volume_size=25,
                volume_type="gp2",
                delete_on_termination=True,
            ),
        )
    ],
    network_interfaces=[
        aws.ec2.LaunchTemplateNetworkInterfaceArgs(
            associate_public_ip_address="true",
            security_groups=[application_security_group.id],
        )
    ],
    user_data=user_data,
    iam_instance_profile={
        "name": ec2_instance_profile.name,
    },
    tag_specifications=[
        aws.ec2.LaunchTemplateTagSpecificationArgs(
            resource_type="instance",
            tags={
                "Name": "mb_asg",
            },
        )
    ],
)

# Create application load balancer
load_balancer = aws.lb.LoadBalancer(
    "mb-alb",
    internal=False,
    load_balancer_type="application",
    security_groups=[lb_security_group.id],
    subnets=[subnet.id for subnet in public_subnets],
    tags={
        "Name": "mb-alb",
    },
)

# Create load balancer target group
target_group = aws.lb.TargetGroup(
    "mb-target-group",
    port=8080,
    protocol="HTTP",
    vpc_id=vpc.id,
    target_type="instance",
    # slow_start=120,
    health_check=aws.lb.TargetGroupHealthCheckArgs(
        enabled=True,
        protocol="HTTP",
        path="/healthz",
        port="8080",
    ),
)

# Create a listener
ssl_certificate_arn = config.require("ssl_certificate_arn")

listener = aws.lb.Listener(
    "mb-listener",
    load_balancer_arn=load_balancer.arn,
    # port=80,
    port=443,  # A10: for HTTPS port
    protocol="HTTPS",  # A10: with SSL
    default_actions=[
        {
            "type": "forward",
            "target_group_arn": target_group.arn,
        }
    ],
    ssl_policy="ELBSecurityPolicy-2016-08",
    certificate_arn=ssl_certificate_arn,
)

# create auto scaling group
auto_scaling_group = aws.autoscaling.Group(
    "mb-asg",
    min_size=1,
    max_size=3,
    desired_capacity=1,
    default_cooldown=60,
    launch_template=aws.autoscaling.GroupLaunchTemplateArgs(
        id=launch_template.id,
        version="$Latest",
    ),
    vpc_zone_identifiers=[subnet.id for subnet in public_subnets],
    target_group_arns=[target_group.arn],
    tags=[
        {
            "key": "Name",
            "value": "Auto Scaling Group",
            "propagate_at_launch": True,
        }
    ],
)

# Create AutoScaling Policies
# Scale Up Policy
scale_up_policy = aws.autoscaling.Policy(
    "scaleUpPolicy",
    scaling_adjustment=1,
    adjustment_type="ChangeInCapacity",
    cooldown=300,
    autoscaling_group_name=auto_scaling_group.name,
)

# Scale Down Policy
scale_down_policy = aws.autoscaling.Policy(
    "scaleDownPolicy",
    scaling_adjustment=-1,
    adjustment_type="ChangeInCapacity",
    cooldown=300,
    autoscaling_group_name=auto_scaling_group.name,
)

# Create CloudWatch CPU Utilization Alarms
# High CPU Utilization Alarm (for Scale Up)
cpu_high_alarm = aws.cloudwatch.MetricAlarm(
    "cpuHighAlarm",
    comparison_operator="GreaterThanOrEqualToThreshold",
    evaluation_periods=1,
    metric_name="CPUUtilization",
    namespace="AWS/EC2",
    period=300,
    statistic="Average",
    threshold=3.0,
    alarm_actions=[scale_up_policy.arn],
    dimensions={"AutoScalingGroupName": auto_scaling_group.name},
)

# Low CPU Utilization Alarm (for Scale Down)
cpu_low_alarm = aws.cloudwatch.MetricAlarm(
    "cpuLowAlarm",
    comparison_operator="LessThanOrEqualToThreshold",
    evaluation_periods=1,
    metric_name="CPUUtilization",
    namespace="AWS/EC2",
    period=300,
    statistic="Average",
    threshold=2.0,
    alarm_actions=[scale_down_policy.arn],
    dimensions={"AutoScalingGroupName": auto_scaling_group.name},
)

# Create Route53 A record
zone_id = config.require("hosted_zone_id")
zone_name = config.require("hosted_zone_name")

hosted_zone = aws.route53.get_zone(
    name=zone_name,
)

dns_record = aws.route53.Record(
    "mb-dns-record",
    name=zone_name,
    zone_id=hosted_zone.zone_id,
    type="A",
    aliases=[
        {
            "name": load_balancer.dns_name,
            "zone_id": load_balancer.zone_id,
            "evaluate_target_health": True,
        }
    ],
)

# Create a DynamoDB table
dynamodb_table = aws.dynamodb.Table(
    "dynamoDBTable",
    attributes=[
        aws.dynamodb.TableAttributeArgs(
            name="email",
            type="S",
        ),
        aws.dynamodb.TableAttributeArgs(
            name="timestamp",
            type="S",
        ),
    ],
    hash_key="email",
    range_key="timestamp",
    read_capacity=1,
    write_capacity=1,
)
pulumi.export("dynamoDBTable-name", dynamodb_table.name)

# IAM Role for Lambda
assume_role_policy = aws.iam.get_policy_document(
    statements=[
        aws.iam.GetPolicyDocumentStatementArgs(
            effect="Allow",
            principals=[
                aws.iam.GetPolicyDocumentStatementPrincipalArgs(
                    type="Service",
                    identifiers=["lambda.amazonaws.com"],
                )
            ],
            actions=["sts:AssumeRole"],
        )
    ]
)

lambda_role = aws.iam.Role("lambdaRole", assume_role_policy=assume_role_policy.json)

# IAM Policy Document for Lambda
lambda_policy_document = aws.iam.get_policy_document(
    statements=[
        aws.iam.GetPolicyDocumentStatementArgs(
            actions=[
                "dynamodb:*",
                "ses:SendEmail",
                "ses:SendRawEmail",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "sns:Subscribe",
                "sns:Publish",
                "lambda:InvokeFunction",
            ],
            resources=["*"],
        )
    ]
)

lambda_policy = aws.iam.Policy(
    "lambdaPolicy", description="lambda policy", policy=lambda_policy_document.json
)

# # Attach AWSLambdaFullAccess managed policy to the Lambda role
# lambda_full_access_policy_attachment = aws.iam.RolePolicyAttachment(
#     "lambdaFullAccessPolicyAttachment",
#     role=lambda_role.name,
#     policy_arn=config.require("lambda_full_access_policy_arn"),
# )

# # Attach AWSLambdaBasicExecutionRole managed policy to the Lambda role
# lambda_basic_execution_policy_attachment = aws.iam.RolePolicyAttachment(
#     "lambdaBasicExecutionPolicyAttachment",
#     role=lambda_role.name,
#     policy_arn=config.require("lambda_basic_execution_role_policy_arn"),
# )

# Attach policy to the Lambda role
lambda_policy_attachment = aws.iam.RolePolicyAttachment(
    "lambdaPolicyAttachment",
    role=lambda_role.name,
    policy_arn=lambda_policy.arn,
)

#
ses_sender_email = config.require("ses_sender_email")
googleProject = config.require("googleProject")
googleBucketName = config.require("googleBucketName")
github_url = config.require("github_url")
region = config.require("region")

# Lambda Function
dynamodb_table_name = dynamodb_table.name
lambda_function_code = config.require("lambda_function_code")
# aws_s3_bucket_name = config.require("aws_s3_bucket_name")

googleServiceAccountKey = pulumi.Output.all(service_account_key.private_key).apply(
    lambda args: args[0]
)

current_file_path = os.path.dirname(os.path.abspath(__file__))
def store_key_as_json(key):
    if key:
        decoded_key = base64.b64decode(key).decode("utf-8")
        try:
            json_key = json.loads(decoded_key)
            return json.dumps(json_key, indent=4)
        except json.JSONDecodeError:
            print("Failed to decode JSON key")
    return None

googleServiceAccountKey_json = service_account_key.private_key.apply(store_key_as_json)

lambda_function = aws.lambda_.Function(
    "lambda-function",
    code=lambda_function_code,
    # code=pulumi.FileArchive("lambda_function.zip"),
    handler="lambda_function.lambda_handler",
    runtime="python3.11",
    role=lambda_role.arn,
    environment=aws.lambda_.FunctionEnvironmentArgs(
        variables={
            "GOOGLE_SERVICE_ACCOUNT_KEY": googleServiceAccountKey_json,
            # "AWS_S3_BUCKET_NAME": aws_s3_bucket_name,
            "GOOGLE_PROJECT": googleProject,
            "BUCKET_NAME": googleBucketName,
            "SES_SENDER_EMAIL": ses_sender_email,
            "DYNAMODB_TABLE_NAME": dynamodb_table_name,
            "GITHUB_URL": github_url,
            "REGION_NAME": region,
        },
    ),
)
pulumi.export("lambda-function-name", lambda_function.name)

# Lambda Permission for SNS
with_sns = aws.lambda_.Permission(
    "withSNS",
    action="lambda:InvokeFunction",
    function=lambda_function.name,
    principal="sns.amazonaws.com",
    source_arn=sns_topic.arn,
)

# SNS Subscription to Lambda
lambda_sns = aws.sns.TopicSubscription(
    "lambda",
    topic=sns_topic.arn,
    protocol="lambda",
    endpoint=lambda_function.arn,
    delivery_policy="""{
      "healthyRetryPolicy": {
        "minDelayTarget": 1,
        "maxDelayTarget": 10,
        "numRetries": 1,
        "numMaxDelayRetries": 0,
        "numNoDelayRetries": 0,
        "numMinDelayRetries": 0,
        "backoffFunction": "linear"
      }
    }""",
)
