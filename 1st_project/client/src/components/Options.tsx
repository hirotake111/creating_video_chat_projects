import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
export default function Options({ children }: Props) {
  return <div>{children}</div>;
}
