# Well-instrumented Serverless Application 
### AWS Lambda + AWS API Gateway + Express + New Relic Browser

WIP. Real user monitoring for validating a AWS Lambda-powered web application.

Uses AWS CodeDeploy hooks to automatically roll back a deployment if frontend errors are detected.

### requirements

* AWS Account
* New Relic Account with Browser
* New Relic Insights Query Key

### additional instrumentation included

**Custom Metrics**
* Time to interactive (frontend)
* Time to hero image (frontend)

**Custom Facets**
* Deployed function version (i.e. backend deployed version)

### setup

Install dependencies:
```
   $ cd express-app
   $ npm install
```

Set Amazon S3 bucket name to store packaged code artifacts:
```
   $ export LAMBDA_BUCKET_NAME=<<name of an s3 bucket to store function package>>
```

### packaging

Package the AWS SAM application using the [AWS SAM Local](https://github.com/awslabs/aws-sam-local) tool:
```
    $ sam package --template-file template.yaml --s3-bucket $LAMBDA_BUCKET_NAME --output-template-file packaged.yaml
```

### deploying

```
    $ sam deploy --template-file ./packaged.yaml --stack-name lambda-stack-postdeploy --capabilities CAPABILITY_NAMED_IAM --parameter-overrides "NRAccountId=<<account id>>" "NRInsightsQueryKey=<<insights query key>>"
```
