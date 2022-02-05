import { Box, TextField } from "@mui/material";
import { FormEventHandler, useEffect, useMemo, useRef } from "react";

import { useSocketContext } from "./SocketContext";

export default function Landing() {
  const context = useSocketContext();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const handleChange: FormEventHandler = (e) => {
    e.preventDefault();
    if (!ref.current?.value) {
      return console.log("empty value -> skip setting name");
    }
    if (!context) {
      return console.log("empty config");
    }

    const { setName, setCallStatus } = context;
    // set username
    setName(ref.current.value);
    setCallStatus({ type: "available" });
  };

  const signedIn = useMemo(
    () => context?.callStatus.type !== "notSignedIn",
    [context?.callStatus]
  );

  return (
    <Box
      aria-label="sign in"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: context?.callStatus.type !== "notSignedIn" ? "0%" : "100%",
        transition: "0.3s",
      }}
    >
      {!(context?.callStatus.type !== "notSignedIn") && (
        <form onSubmit={handleChange}>
          <TextField label="Enter Your Name" inputRef={ref} focused />
        </form>
      )}
    </Box>
  );
}
