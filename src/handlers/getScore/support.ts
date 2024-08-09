import { IDynamoClient } from "../../adapters/dynamodb";

function getUserInfoFromDatabase(
  userId: string,
  dynamoDbClient: IDynamoClient,
  usersTableName: string,
) {
  const response = dynamoDbClient.getItem({ userId }, usersTableName);
  return response;
}


export { getUserInfoFromDatabase };
