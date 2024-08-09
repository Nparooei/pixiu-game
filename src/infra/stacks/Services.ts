import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { createTable } from "../common/dynamodb";
import { createLambdaHandler } from "../common/lambda";
import {
  createApiGateway,
  createLambdaIntegration,
} from "../common/api-gateway";
// import { createWaf } from "../common/waf";

interface GetWalletApiGatewayProps extends cdk.StackProps {
  cognitoUserPoolId: string;
}

export class Services extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GetWalletApiGatewayProps) {
    super(scope, id, props);

    const usersTable = createTable(this, "usersTelegramTable", {
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const getScoreHandler = createLambdaHandler(this, "getScoreHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      entry: "src/handlers/getScore/index.ts",
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });


    usersTable.grantReadWriteData(getScoreHandler);

    const postScoreHandler = createLambdaHandler(this, "postScoreHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      entry: "src/handlers/postScore/index.ts",
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });

    usersTable.grantReadWriteData(postScoreHandler);


    const Api = createApiGateway(this, "pixiu-telegram-api-gatway", {});

  

    createLambdaIntegration({
      apiGateway: Api,
      method: postScoreHandler,
      methodName: "post-score",
      methodType: "POST",
      enableCors: true,
      
    });

    createLambdaIntegration({
      apiGateway: Api,
      method: getScoreHandler,
      methodName: "get-score",
      methodType: "POST",
      enableCors: true,
    });


    // createWaf(this, "Waf", {
    //   stageName: Api.deploymentStage.stageName,
    //   restApiId: Api.restApiId,
    //   region: "us-east-1",
    // });
  }
}
