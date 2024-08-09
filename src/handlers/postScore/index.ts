import { IDynamoClient, createDynamoClient } from "../../adapters/dynamodb";
import { EnvVariableSchema } from "../../shared/domain/domainTransferObjects";
import { makeLogger } from "../../shared/logging/logger";
import { makeHandler } from "./handler";

const usersTable = EnvVariableSchema.parse(process.env.USERS_TABLE);
const dynamoDbClient: IDynamoClient = createDynamoClient();
const logger = makeLogger();

const handler = makeHandler({
  usersTable,
  dynamoDbClient: dynamoDbClient,
  logger,
});

export { handler };
