import { CallUserMessage } from "./types";

const GetError = (message: string) => {
  return new Error(`Validation error: ${message}`);
};

export const validateCallUserMessage = (data: any): CallUserMessage => {
  if (!data) throw GetError("data is undefined or null");
  const { callee, caller, signal } = data as CallUserMessage;
  if (
    !(
      caller &&
      typeof caller.id === "string" &&
      typeof caller.name === "string"
    )
  )
    throw GetError(`invalid 'caller' object: : ${JSON.stringify(caller)}}`);
  if (
    !(
      callee &&
      typeof callee.id === "string" &&
      typeof callee.name === "string"
    )
  )
    throw GetError(`invalid 'callee' object: : ${JSON.stringify(callee)}}`);
  if (!(signal && typeof signal.type === "string" && typeof signal))
    throw GetError(`invalid 'signal' object: ${JSON.stringify(signal)}}`);

  return { caller, callee, signal };
};
