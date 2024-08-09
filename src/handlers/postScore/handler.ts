import { makeApiGatewayResult } from "../../adapters/api-gatway";
import { IDynamoClient } from "../../adapters/dynamodb";
import { handleError } from "../../shared/error-handling/map-error";
import { Logger } from "../../shared/logging/logger";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { getRequestClaims } from "../utils";
import { getUserInfoFromDatabase } from "../getScore/support";
import { setUserInDatabase } from "./support";

interface makeHandlerProps {
  usersTable: string;
  dynamoDbClient: IDynamoClient;
  logger: Logger;
}

function makeHandler(props: makeHandlerProps) {
  return async (event: APIGatewayProxyEvent) => {
    try {


      console.log("event", event);

      const { dynamoDbClient, usersTable } = props;
      const { userId,userScore,userToken } = getRequestClaims(event);

      //TODO: add some checking for id validation

      const response = await getUserInfoFromDatabase(
        userId,
        dynamoDbClient,
        usersTable,
      );

      //TODO :add some checking for fraud


      const setResponse = await setUserInDatabase({
        dynamoDbClient,
        usersTable,
        recordDetails:{userId,userScore,userToken},
    });

      if (!setResponse)
        return makeApiGatewayResult("error", 400);


      return makeApiGatewayResult("ok", 201);
    } catch (error: unknown) {
      return handleError(error);
    }
  };
}

export { makeHandler };
