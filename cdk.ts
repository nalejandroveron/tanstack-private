import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cdk from 'aws-cdk-lib';
import {
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_lambda,
  aws_route53,
  aws_route53_targets,
  aws_s3,
  aws_s3_deployment,
} from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { env } from './env';

const directory = path.dirname(fileURLToPath(import.meta.url));
const serverFnPath = path.join(directory, '.output/server');
const assetsPath = path.join(directory, '.output/public');

//FIXME: Replace with your domain
const domain = 'mydomain.com';

class AppStack extends cdk.Stack {
  private readonly bucket: aws_s3.Bucket;
  private readonly serverFn: aws_lambda.Function;
  private readonly certificate: aws_certificatemanager.Certificate;
  private readonly distribution: aws_cloudfront.Distribution;
  private readonly hostedZone: aws_route53.HostedZone;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.hostedZone = new aws_route53.PublicHostedZone(this, 'appHostedZone', {
      zoneName: domain,
    });

    this.certificate = new aws_certificatemanager.Certificate(
      this,
      'AppCertificate',
      {
        domainName: this.hostedZone.zoneName,
        subjectAlternativeNames: [`*.${this.hostedZone.zoneName}`],
        validation: aws_certificatemanager.CertificateValidation.fromDns(
          this.hostedZone,
        ),
      },
    );

    this.bucket = new aws_s3.Bucket(this, 'AppBucket', {
      enforceSSL: true,
      minimumTLSVersion: 1.2,
      blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    this.serverFn = new aws_lambda.Function(this, 'AppServerFn', {
      runtime: aws_lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: aws_lambda.Code.fromAsset(serverFnPath),
      timeout: cdk.Duration.seconds(25),
      environment: {
        ...env,
        BETTER_AUTH_URL: `https://${this.hostedZone.zoneName}`,
      },
      memorySize: 1024,
    });

    const fnUrl = this.serverFn.addFunctionUrl({
      //FIXME: Should be AWS_IAM, but POST requests are not working since
      // you need to pass `x-amz-content-sha256` header with the SHA-256
      // hash of the request payload. This is not possible with the current
      // setup. The only way to make POST requests work is to use NONE.
      // See: https://x.com/rooToTheZ/status/1788606025265975505
      // authType: aws_lambda.FunctionUrlAuthType.AWS_IAM,
      authType: aws_lambda.FunctionUrlAuthType.NONE,
    });

    // Handles buckets whether or not they are configured for website hosting.
    this.distribution = new aws_cloudfront.Distribution(
      this,
      'AppDistribution',
      {
        certificate: this.certificate,
        domainNames: [this.hostedZone.zoneName],
        defaultBehavior: {
          origin: new aws_cloudfront_origins.FunctionUrlOrigin(fnUrl, {}),
          cachedMethods: aws_cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          cachePolicy: aws_cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy:
            aws_cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        additionalBehaviors: {
          '_build/*': {
            origin:
              aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
                this.bucket,
                {
                  originAccessLevels: [
                    aws_cloudfront.AccessLevel.READ,
                    aws_cloudfront.AccessLevel.LIST,
                  ],
                },
              ),
            allowedMethods:
              aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
            viewerProtocolPolicy:
              aws_cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          },
        },
      },
    );

    new aws_s3_deployment.BucketDeployment(this, 'AppBucketDeployAssets', {
      sources: [aws_s3_deployment.Source.asset(assetsPath)],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ['/_build/*'],
    });

    new aws_route53.ARecord(this, 'AppDistributionARecord', {
      zone: this.hostedZone,
      ttl: cdk.Duration.minutes(5),
      target: aws_route53.RecordTarget.fromAlias(
        new aws_route53_targets.CloudFrontTarget(this.distribution),
      ),
    });
  }
}

const app = new cdk.App();

new AppStack(app, 'AppStack');
