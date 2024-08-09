#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Services } from "../src/infra/stacks/Services";
import { PixiuFrontEnd } from "../src/infra/stacks/PixiuFrontEnd";

const app = new cdk.App();
new Services(app, "TelegramServicesStack", {
  cognitoUserPoolId: "crypto-wallet-user-pool",
});

new PixiuFrontEnd(app, "PixiuFrontEnd", {
  cognitoUserPoolId: "crypto-wallet-user-pool",
});

