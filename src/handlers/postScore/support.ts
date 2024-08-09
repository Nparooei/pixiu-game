import { IDynamoClient } from "../../adapters/dynamodb";
import {  postScoreInputSchema} from "../../shared/domain/domainTransferObjects";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { User } from "../../shared/domain/entities";
interface saveScoreToDbProps {
  dynamoDbClient:IDynamoClient,
    usersTable:string,
    recordDetails:User
}

async function setUserInDatabase(props: saveScoreToDbProps) {
  const {
    dynamoDbClient,
    usersTable,
    recordDetails,
  } = props;

  await dynamoDbClient.updateItem(
    {
      ...recordDetails,
    },
    usersTable,
  );

  return "Transaction confirmed";
}

function handleInputBody(event: APIGatewayProxyEvent) {
  if (!event || !event.body) throw new Error("Invalid input body");
  const body = postScoreInputSchema.parse(JSON.parse(event.body));
  const { userId,userScore,userToken } = body;
  return { userId,userScore,userToken };
}

export { setUserInDatabase, handleInputBody };
