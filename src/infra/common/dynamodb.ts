import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createResourceId } from "../../shared/utils";

function createTable(
  scope: Construct,
  id: string,
  props: dynamodb.TableProps,
): dynamodb.Table {
  const tableName = createResourceId(id);
  return new dynamodb.Table(scope, tableName, {
    contributorInsightsEnabled: true,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    tableName: id,
    removalPolicy: cdk.RemovalPolicy.RETAIN,
    pointInTimeRecovery: true,
    encryption: dynamodb.TableEncryption.AWS_MANAGED,
    ...props,
  });
}

export { createTable };
