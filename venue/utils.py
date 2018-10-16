import boto3
from botocore.exceptions import ClientError
import os

S3_BUCKET = os.environ.get("S3_BUCKET")


def in_bucket(key, bucket_name=S3_BUCKET, s3=None):
    """Checks if the object with the given key is in the S3 bucket"""
    if s3 is None:
        s3 = boto3.client('s3', region_name='eu-west-3')
    try:
        response = s3.head_object(Bucket=bucket_name,
                                  Key=key)
    except ClientError as e:
        if e.response['Error']['Code'] == "404":
            return False
        else:
            raise e
    return True
