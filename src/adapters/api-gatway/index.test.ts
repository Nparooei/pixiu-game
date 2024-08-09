import { makeApiGatewayResult } from ".";

describe("makeApiGatewayResult", () => {
  test("returns a valid APIGatewayProxyResult", () => {
    const response = { message: "Hello, world!" };
    const statusCode = 200;

    const result = makeApiGatewayResult(
      JSON.stringify(response),
      statusCode,
      {},
    );

    expect(result.statusCode).toEqual(statusCode);
  });
});
