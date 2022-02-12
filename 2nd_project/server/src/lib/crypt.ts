import { hash, compare } from "bcrypt";
import { config } from "../config";

/**
 * return hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, config.saltRounds);
};

/**
 * return true if password matched
 */
export const checkPassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return compare(password, hashed);
};
