import { lambdaInputSchema, userAttributesSchema } from "../shared/domain/domainTransferObjects";
import type { APIGatewayProxyEvent } from "aws-lambda";

function getRequestClaims(event: APIGatewayProxyEvent) {
  const parsedEvent = lambdaInputSchema.parse(event);
  const {body}=parsedEvent;
  const {userId,userScore,userToken}=userAttributesSchema.parse(JSON.parse(body));
  return { userId,userScore:userScore || "0",userToken };
}

export { getRequestClaims };
