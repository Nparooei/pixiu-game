import { makeApiGatewayResult } from "../../adapters/api-gatway";
import { IDynamoClient } from "../../adapters/dynamodb";
import { handleError } from "../../shared/error-handling/map-error";
import { Logger } from "../../shared/logging/logger";
import type { APIGatewayProxyEvent } from "aws-lambda";
import {
  getUserInfoFromDatabase,
} from "./support";
import { getRequestClaims } from "../utils";
import { User, UserSchema } from "../../shared/domain/entities";

interface makeHandlerProps {
  usersTableName: string;
  dynamoDbClient: IDynamoClient;
  logger: Logger;
}

function makeHandler(props: makeHandlerProps) {
  return async (event: APIGatewayProxyEvent) => {
    try {
      const { dynamoDbClient, usersTableName, logger } = props;

      console.log("event", event);

      const { userId } = getRequestClaims(event);

      let databaseResponse: User | undefined;
      const userInfo = await getUserInfoFromDatabase(
        userId,
        dynamoDbClient,
        usersTableName,
      );
      try {
        databaseResponse = UserSchema.parse(userInfo);
      } catch (error) {
        logger.info("id not found", error);
      }

      return makeApiGatewayResult(databaseResponse?.userScore || "0", 201);
    } catch (error: unknown) {
      return handleError(error);
    }
  };
}

export { makeHandler };
