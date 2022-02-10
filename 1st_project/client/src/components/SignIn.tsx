import { Box, TextField, useMediaQuery } from "@mui/material";
import { FormEventHandler, useEffect, useRef } from "react";

import { useSocketContext } from "./SocketContext";

export default function SignIn() {
  const context = useSocketContext();
  const ref = useRef<HTMLInputElement>(null);
  const mobile = useMediaQuery("(max-width:480px)");

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

  return (
    <Box
      aria-label="sign in"
      sx={{
        height: context?.callStatus.type !== "notSignedIn" ? "0%" : "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: mobile ? "start" : "center",
          paddingTop: mobile ? "100px" : 0,
          width: "100vw",
          height: "100%",
          transition: "0.3s",
        }}
      >
        {!(context?.callStatus.type !== "notSignedIn") && (
          <form onSubmit={handleChange}>
            <TextField label="Enter Your Name" inputRef={ref} focused />
          </form>
        )}
      </Box>
    </Box>
  );
}
