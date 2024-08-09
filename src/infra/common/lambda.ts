import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { createResourceId } from "../../shared/utils";

function createLambdaHandler(
  scope: Construct,
  id: string,
  props: NodejsFunctionProps,
) {
  const functionName = createResourceId(id);
  return new NodejsFunction(scope, functionName, {
    functionName: id,
    bundling: {
      externalModules: ["aws-sdk"],
      forceDockerBundling: false,
    },
    logRetention:logs.RetentionDays.ONE_DAY,
    ...props,
  });
}

export { createLambdaHandler };
