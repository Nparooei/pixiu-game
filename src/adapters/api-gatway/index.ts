import type { APIGatewayProxyResult } from "aws-lambda";

const makeApiGatewayResult = (
  response: string,
  statusCode: number,
  headersContent: {
    [header: string]: boolean | number | string;
  } = {},
): APIGatewayProxyResult => {
  return {
    statusCode,
    body:response,
    headers: {
       "Content-Type": "application/json",
       "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Credentials": true,

      // "Strict-Transport-Security": "max-age=31536000; includeSubdomains;",
      // "X-Frame-Options": "DENY",
      // "Content-Security-Policy":
      //   "default-src 'none'; frame-ancestors 'none'; require-trusted-types-for 'script'; upgrade-insecure-requests;",
      // "X-Content-Type-Options": "nosniff",
     ...headersContent,
    },
  };
};

export { makeApiGatewayResult };
