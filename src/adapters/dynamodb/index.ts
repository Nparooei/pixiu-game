import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  DeleteItemCommandOutput,
  DeleteItemCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { MarshalledItem, UnMarshalledItem } from "./types";

interface IDynamoClient {
  putItem(
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<PutItemCommandOutput>;
  scanItems(tableName: string): Promise<UnMarshalledItem[]>;
  deleteItem(
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<DeleteItemCommandOutput>;
  updateItem(
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<UnMarshalledItem>;
  getItem(
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<UnMarshalledItem | undefined>;
}

const createDynamoClient = (): IDynamoClient => {
  const client = new DynamoDBClient();

  const putItem = async (
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<PutItemCommandOutput> => {
    const marshallParams = marshall(params);
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshallParams,
      ConditionExpression: "attribute_not_exists(userId)",
    });
    return client.send(command);
  };

  const updateItem = async (
    item: UnMarshalledItem,
    tableName: string,
  ): Promise<UnMarshalledItem> => {
    console.log("item-->", item);
    console.log("tableName-->", tableName);
    const userId = item.userId;
    const updateParams: UpdateItemCommandInput = {
      TableName: tableName,
      Key: marshall({ userId }),
      UpdateExpression: "set",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ReturnValues: "ALL_NEW"
    };

    const updateExpressions: string[] = [];
    for (const [key, value] of Object.entries(item)) {
      if (key !== "userId") {
        const placeholder = `#${key}`;
        updateParams.ExpressionAttributeNames![placeholder] = key;
        updateParams.ExpressionAttributeValues![`:${key}`] = marshall({
          [key]: value,
        })[key];
        updateExpressions.push(`${placeholder} = :${key}`);
      }
    }
    updateParams.UpdateExpression = `set ${updateExpressions.join(", ")}`;
    const response = await client.send(new UpdateItemCommand(updateParams));
    return unmarshall(response.Attributes!);
  };

  const scanItems = async (
    tableName: string,
    limit = 1000,
  ): Promise<UnMarshalledItem[]> => {
    const command = new ScanCommand({ TableName: tableName, Limit: limit });
    const response = await client.send(command);
    if (response && response.Items) {
      return batchUnMarshall(response.Items);
    }
    return [];
  };

  const deleteItem = async (
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<DeleteItemCommandOutput> => {
    const marshallParams = marshall(params);
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: marshallParams,
    });
    return client.send(command);
  };

  const getItem = async (
    params: UnMarshalledItem,
    tableName: string,
  ): Promise<UnMarshalledItem | undefined> => {
    const marshallParams = marshall(params);
    const command = new GetItemCommand({
      TableName: tableName,
      Key: marshallParams,
    });
    const response = await client.send(command);
    if (!response.Item) {
      return undefined;
    }
    return unmarshall(response.Item);
  };

  return {
    putItem,
    scanItems,
    deleteItem,
    updateItem,
    getItem,
  };
};

const batchUnMarshall = (items: MarshalledItem[]): UnMarshalledItem[] => {
  return items.map((item) => unmarshall(item));
};

export { createDynamoClient, IDynamoClient };
