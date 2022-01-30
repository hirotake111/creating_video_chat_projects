export interface CallUserData {
  userToCall: string;
  signalData: any;
  from: string;
  name: string;
}

export interface AnswerData {
  to: string;
  signal: any;
}
