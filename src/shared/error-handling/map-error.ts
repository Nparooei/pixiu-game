import { ZodError } from "zod";
import { makeLogger } from "../logging/logger";
import { makeApiGatewayResult } from "../../adapters/api-gatway";

const logger = makeLogger();

const handleError = (error: unknown) => {
  if (error instanceof Error) {
    logger.error(error, { error });
  } else {
    logger.error("Unexpected error happened", { error });
  }

  const errorResponse = mapError(error);

  return makeApiGatewayResult(errorResponse.message, errorResponse.status, {});
};

function mapError(error: unknown) {
  if (error instanceof ZodError) {
    return { message: JSON.stringify(error.issues), status: 400 };
  }

  if (error instanceof Error) {
    return { message: `${error.name}  |  ${error.message}`, status: 400 };
  }

  return {
    message: "Unexpected error",
    status: 500,
  };
}

export { handleError };
