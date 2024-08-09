import { Construct } from "constructs";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { createResourceId } from "../../shared/utils";

interface WafProps {
  region: string;
  restApiId: string;
  stageName: string;
}
function createWaf(scope: Construct, id: string, props: WafProps) {
  const { region, restApiId, stageName } = props;
  const webAclName = createResourceId(id + "-WebACL");
  const webAcl = new wafv2.CfnWebACL(scope, webAclName, {
    name: webAclName,
    scope: "REGIONAL",
    defaultAction: {
      allow: {},
    },
    rules: [
      {
        name: "AWS-AWSManagedRulesCommonRuleSet",
        priority: 1,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            name: "AWSManagedRulesCommonRuleSet",
            vendorName: "AWS",
          },
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AWSManagedRulesCommonRuleSet",
        },
      },
      {
        name: "RateLimitRule",
        priority: 2,
        action: {
          block: {},
        },
        statement: {
          rateBasedStatement: {
            limit: 200,
            aggregateKeyType: "IP",
          },
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "RateLimitRule",
        },
      },
    ],
    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      metricName: "WebACL",
      sampledRequestsEnabled: true,
    },
  });

  new wafv2.CfnWebACLAssociation(scope, createResourceId("WebACLAssociation"), {
    resourceArn: `arn:aws:apigateway:${region}::/restapis/${restApiId}/stages/${stageName}`,
    webAclArn: webAcl.attrArn,
  });
}

export { createWaf };
