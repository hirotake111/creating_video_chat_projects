import { CallUserPayload } from "./types";

const GetError = (message: string) => {
  return new Error(`Validation error: ${message}`);
};

export const validateCallUserPayload = (data: any): CallUserPayload => {
  if (!data) throw GetError("data is undefined or null");
  const { callerId, callerName, signal } = data as CallUserPayload;
  if (typeof callerId !== "string") throw GetError("'from' should be string");
  if (typeof callerName !== "string")
    throw GetError("'callerName' should be string");
  if (typeof signal !== "string") throw GetError("'signal' should be string");

  return { callerId, callerName, signal };
};
