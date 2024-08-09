import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront_origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

interface GetWalletApiGatewayProps extends cdk.StackProps {
  cognitoUserPoolId: string;
}

export class PixiuFrontEnd extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GetWalletApiGatewayProps) {
    super(scope, id, props);

    // S3 Bucket for static website hosting
    const existingBucket = s3.Bucket.fromBucketArn(this, "ExistingBucket", "arn:aws:s3:::pixiu-hosting");

    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(existingBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    // Deploy local files to the existing S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./front-end")],
      destinationBucket: existingBucket,
      distribution: distribution, // Reference your CloudFront distribution
      distributionPaths: ['/*'], // Invalidate all paths
    });

    // CloudFront distribution for the existing S3 bucket
    

    new cdk.CfnOutput(this, "BucketURL", {
      value: existingBucket.bucketWebsiteUrl,
      description: "URL for the website hosted in the S3 bucket",
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: distribution.domainName,
      description: "CloudFront distribution domain name",
    });
  }
}
