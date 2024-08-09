import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { createResourceId } from "../../shared/utils";
import * as cognito from "aws-cdk-lib/aws-cognito";

function createApiGateway(
  scope: Construct,
  id: string,
  props: apigateway.RestApiProps,
): apigateway.RestApi {
  const apiName = createResourceId(id);
  return new apigateway.RestApi(scope, apiName, {
    deployOptions: {
      stageName: "prod",
    },
    restApiName: id,
    ...props,
  });
}

export { createApiGateway };

interface createAuthorizerProps {
  userPool: cognito.IUserPool;
}

function createAuthorizer(
  scope: Construct,
  id: string,
  props: createAuthorizerProps,
) {
  const { userPool } = props;
  const apiName = createResourceId(id);
  return new apigateway.CognitoUserPoolsAuthorizer(scope, apiName, {
    cognitoUserPools: [userPool],
  });
}

interface createLambdaIntegrationProps {
  apiGateway: apigateway.RestApi;
  method: cdk.aws_lambda.Function;
  methodName: string;
  methodType: "GET" | "POST" | "PUT" | "DELETE";
  enableCors?: boolean;
}

function createLambdaIntegration(
  props: createLambdaIntegrationProps,
): apigateway.LambdaIntegration {
  const { apiGateway, method, methodName, methodType } = props;
  const integration = new apigateway.LambdaIntegration(method);
  let resource = apiGateway.root.getResource(methodName);
  if (resource === undefined) {
    resource = apiGateway.root.addResource(methodName);
  }
  resource.addMethod(methodType, integration ,{
    //no authorization
    apiKeyRequired: false,
    authorizer: undefined,
  });

  if (props.enableCors) {
   resource.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Credentials': "'true'",
          'method.response.header.Access-Control-Allow-Headers': "'*'",
          'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,POST'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Expose-Headers': "'*'"
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      methodResponses: [{
        statusCode: '200',
        responseParameters: {
          'method.response.header.Access-Control-Allow-Credentials': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Expose-Headers': true
        }
      }]
    });
  }
  return integration;
}

export { createLambdaIntegration };
