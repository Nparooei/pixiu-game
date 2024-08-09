import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandOutput,
  ScanCommand,
  DeleteItemCommand,
  DeleteItemCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { UnMarshalledItem, MarshalledItem } from "./types";
import { IDynamoClient, createDynamoClient } from ".";

jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/util-dynamodb");

describe("createDynamoClient", () => {
  let client: IDynamoClient;
  const tableName = "TestTable";
  const mockDynamoDBClient = DynamoDBClient as jest.MockedClass<
    typeof DynamoDBClient
  >;
  const marshallMock = marshall as jest.Mock;
  const unmarshallMock = unmarshall as jest.Mock;

  beforeEach(() => {
    mockDynamoDBClient.mockClear();
    client = createDynamoClient();
  });

  it("should call DynamoDBClient with the correct parameters for putItem", async () => {
    const params: UnMarshalledItem = { id: "123", name: "Test Item" };
    const marshallParams = { id: { S: "123" }, name: { S: "Test Item" } };
    marshallMock.mockReturnValue(marshallParams);

    const mockResponse: PutItemCommandOutput = {
      $metadata: { httpStatusCode: 200 },
    };

    (DynamoDBClient.prototype.send as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    const response = await client.putItem(params, tableName);

    expect(response).toEqual(mockResponse);
    expect(marshall).toHaveBeenCalledWith(params);
    expect(DynamoDBClient.prototype.send).toHaveBeenCalledWith(
      expect.any(PutItemCommand),
    );
  });

  it("should call DynamoDBClient with the correct parameters for scanItems", async () => {
    const mockItems: MarshalledItem[] = [
      { id: { S: "123" }, name: { S: "Test Item" } },
    ];
    const unmarshalledItems: UnMarshalledItem[] = [
      { id: "123", name: "Test Item" },
    ];
    unmarshallMock.mockReturnValue(unmarshalledItems[0]);

    (DynamoDBClient.prototype.send as jest.Mock).mockResolvedValue({
      Items: mockItems,
    });

    const response = await client.scanItems(tableName);

    expect(response).toEqual(unmarshalledItems);
    expect(DynamoDBClient.prototype.send).toHaveBeenCalledWith(
      expect.any(ScanCommand),
    );
    expect(unmarshall).toHaveBeenCalledWith(mockItems[0]);
  });

  it("should call DynamoDBClient with the correct parameters for deleteItem", async () => {
    const params: UnMarshalledItem = { id: "123" };
    const marshallParams = { id: { S: "123" } };
    marshallMock.mockReturnValue(marshallParams);

    const mockResponse: DeleteItemCommandOutput = {
      $metadata: { httpStatusCode: 200 },
    };

    (DynamoDBClient.prototype.send as jest.Mock).mockResolvedValue(
      mockResponse,
    );

    const response = await client.deleteItem(params, tableName);

    expect(response).toEqual(mockResponse);
    expect(marshall).toHaveBeenCalledWith(params);
    expect(DynamoDBClient.prototype.send).toHaveBeenCalledWith(
      expect.any(DeleteItemCommand),
    );
  });
});
