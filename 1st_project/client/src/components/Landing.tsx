import { Box, TextField } from "@mui/material";
import { FormEventHandler, useMemo, useRef } from "react";

import { useSocketContecxt } from "./SocketContext";

export default function Landing() {
  const context = useSocketContecxt();
  const ref = useRef<HTMLInputElement>(null);

  const handleChange: FormEventHandler = (e) => {
    e.preventDefault();
    if (!ref.current?.value) {
      return console.log("empty value -> skip setting name");
    }
    if (!context) {
      return console.log("empty config");
    }

    const { config, setConfig } = context;

    // set username
    setConfig({ ...config, name: ref.current.value });
  };

  const nameEntered = useMemo(
    () => context?.config.name && context.config.name.length > 0,
    [context]
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: nameEntered ? "0vh" : "100vh",
        transition: "0.3s",
      }}
    >
      {!nameEntered && (
        <form onSubmit={handleChange}>
          <TextField label="Enter Your Name" inputRef={ref} />
        </form>
      )}
    </Box>
  );
}
