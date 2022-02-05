import { AnswerMessage, CallUserMessage } from "./types";

const getError = (message: string) => {
  return new Error(`Validation error: ${message}`);
};

export const validateCallUserMessage = (data: any): CallUserMessage => {
  if (!data) throw getError("data is undefined or null");
  const { callee, caller, signal } = data as CallUserMessage;
  if (
    !(
      caller &&
      typeof caller.id === "string" &&
      typeof caller.name === "string"
    )
  )
    throw getError(`invalid 'caller' object: : ${JSON.stringify(caller)}`);
  if (
    !(
      callee &&
      typeof callee.id === "string" &&
      typeof callee.name === "string"
    )
  )
    throw getError(`invalid 'callee' object: : ${JSON.stringify(callee)}}`);
  if (!(signal && typeof signal.type === "string" && typeof signal))
    throw getError(`invalid 'signal' object: ${JSON.stringify(signal)}`);

  return { caller, callee, signal };
};

export const validateAnswerData = (data: any): AnswerMessage => {
  if (!data) throw getError("data is undefined or null");
  const { caller, signal } = data as AnswerMessage;
  if (!(caller && typeof caller.id === "string" && typeof caller.name))
    throw getError(`invalid 'caller' object: ${JSON.stringify(caller)}`);
  if (!(signal && typeof signal.type === "string"))
    throw getError(`invalid 'signal' object: ${JSON.stringify(signal)}`);

  return { caller, signal };
};
