# Well-instrumented Serverless Application 
### AWS Lambda + AWS API Gateway + Express + New Relic Browser

WIP. Real user monitoring for validating a AWS Lambda-powered web application.

### setup

```
   $ cd express-app
   $ npm install
```

### packaging

```
    $ sam package --template-file template.yaml --s3-bucket $LAMBDA_BUCKET_NAME --output-template-file packaged.yaml
```

### deploying

```
    $ sam deploy --template-file ./packaged.yaml --stack-name lambda-stack-postdeploy --capabilities CAPABILITY_NAMED_IAM
```
