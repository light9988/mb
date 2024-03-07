packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type = string
}

variable "source_ami" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "ami_regions" {
  type = list(string)
}

variable "instance_type" {
  type = string
}

variable "volume_size" {
  type = number
}

variable "volume_type" {
  type = string
}

variable "account_id" {
  type = string
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "webapp-ami" {
  region          = "${var.aws_region}"
  ami_name        = "webapp-ami-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  ami_description = "AMI for webapp"

  ami_users   = ["${var.account_id}"]
  profile     = "dev"
  ami_regions = "${var.ami_regions}"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "${var.instance_type}"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = "${var.volume_size}"
    volume_type           = "${var.volume_type}"
  }

  tags = {
    Name = "webapp-ami"
  }
}

build {
  sources = ["source.amazon-ebs.webapp-ami"]

  # Upload files to /tmp/
  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./user.csv"
    destination = "/tmp/user.csv"
  }

  # Execute shell commands
  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",

      # Install necessary software
      "curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -",
      "sudo apt-get install -y nodejs",
      "sudo apt-get install unzip -y",

      # Move files from /tmp/ to /opt/
      "sudo mkdir -p /opt/webapp",
      "sudo chmod 755 /opt/webapp",
      "sudo mv /tmp/webapp.zip /opt/webapp.zip",
      "sudo mv /tmp/user.csv /opt/user.csv",
      "sudo unzip /opt/webapp.zip -d /opt/webapp",
      "sudo rm /opt/webapp.zip",

      # Install dependencies
      "cd /opt/webapp",
      "sudo npm install",

      # A6: Create group and user
      "sudo groupadd csye6225",
      "sudo useradd -s /bin/false -g csye6225 -m csye6225",
      "sudo chown -R csye6225:csye6225 /opt/webapp",

      # systemd
      "sudo cp packer/webapp.service /etc/systemd/system/webapp.service",
      "sudo systemctl enable webapp.service",
      "sudo systemctl start webapp.service",

      # A7: Install CloudWatch Agent
      "sudo mkdir -p /var/log/webapp/",
      "sudo wget https://amazoncloudwatch-agent-us-west-2.s3.us-west-2.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
      "sudo cp packer/cloudwatch-config.json /opt/cloudwatch-config.json",
      "sudo cp packer/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "sudo chmod 644 /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "sudo systemctl enable amazon-cloudwatch-agent.service",
      "sudo systemctl start amazon-cloudwatch-agent.service",

      # Clean up
      "sudo apt-get clean"
    ]
  }
}
