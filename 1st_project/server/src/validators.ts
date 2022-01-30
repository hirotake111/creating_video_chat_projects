import { AnswerData, CallUserData } from "./types";

const getValidationError = (msg: string): Error => {
  return new Error(`validation error. ${msg}`);
};

export const validateCallUserData = (data: any): CallUserData => {
  if (!data) throw getValidationError("data is undefined or null");
  const { userToCall, signalData, from, name } = data as CallUserData;
  if (typeof userToCall !== "string")
    throw getValidationError("'serToCall' should be string");
  if (typeof signalData === "undefined")
    throw getValidationError("'signalData' should not be undefined");
  if (typeof from !== "string")
    throw getValidationError("'from' should be string");
  if (typeof name !== "string")
    throw getValidationError("'name' should be string");

  return { userToCall, signalData, from, name };
};

export const validateAnswerData = (data: any): AnswerData => {
  if (!data) throw getValidationError("data is undefined or null");
  const { to, signal } = data as AnswerData;
  if (typeof to !== "string")
    throw getValidationError("'from' shold be string");
  if (typeof signal === "undefined")
    throw getValidationError("'signal' should not be undefined");
  return { to, signal };
};
