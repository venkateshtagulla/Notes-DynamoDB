import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

# AWS Credentials from environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-2")
TABLE_NAME = "NotesTable"

# Initialize DynamoDB client
dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

table = dynamodb.Table(TABLE_NAME)


def create_table_if_not_exists():
    """Create the NotesTable if it doesn't exist"""
    global table
    try:
        table.load()
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            # Table doesn't exist, create it
            new_table = dynamodb.create_table(
                TableName=TABLE_NAME,
                KeySchema=[
                    {
                        'AttributeName': 'userId',
                        'KeyType': 'HASH'  # Partition key
                    },
                    {
                        'AttributeName': 'noteId',
                        'KeyType': 'RANGE'  # Sort key
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'userId',
                        'AttributeType': 'S'
                    },
                    {
                        'AttributeName': 'noteId',
                        'AttributeType': 'S'
                    }
                ],
                BillingMode='PAY_PER_REQUEST'
            )
            new_table.wait_until_exists()
            table = new_table
            print(f"Table {TABLE_NAME} created successfully")
        else:
            raise


def get_table():
    """Get the DynamoDB table"""
    return table
