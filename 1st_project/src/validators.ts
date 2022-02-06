import { AnswerMessage, CallUserMessage, Candidate } from "./types";

const getError = (message: string) => {
  return new Error(`Validation error: ${message}`);
};

const validateCandidate = (data: any): Candidate => {
  if (!data) throw getError("data is undefined or null");
  const { id, name, signal } = data as Candidate;
  if (
    !(
      typeof id === "string" &&
      typeof name === "string" &&
      typeof signal === "object" &&
      typeof signal.type === "string"
    )
  )
    throw getError(`invalid 'candidate' object: ${JSON.stringify(data)}`);
  return { id, name, signal };
};

export const validateCallUserMessage = (data: any): CallUserMessage => {
  if (!data) throw getError("data is undefined or null");
  const { callee, caller } = data as CallUserMessage;
  validateCandidate(caller);
  if (
    !(
      callee &&
      typeof callee.id === "string" &&
      typeof callee.name === "string"
    )
  )
    throw getError(`invalid 'callee' object: ${JSON.stringify(callee)}`);
  return { caller, callee };
};

export const validateAnswerMessage = (data: any): AnswerMessage => {
  if (!data) throw getError("data is undefined or null");
  const { caller, callee } = data as AnswerMessage;
  validateCandidate(caller);
  validateCandidate(callee);
  return { caller, callee };
};
