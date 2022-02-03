import { Box, TextField } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useMemo, useRef } from "react";
import { nanoid } from "nanoid";

import { useSocketContecxt } from "./SocketContext";

interface Props {
  onChange: () => void;
}

export default function Landing() {
  const context = useSocketContecxt();
  const ref = useRef<HTMLInputElement>(null);

  const handleChange: FormEventHandler = (e) => {
    e.preventDefault();
    if (!ref.current?.value) {
      console.log("empty value -> skip setting name");
      return;
    }
    // set username
    context?.setName(ref.current.value);
  };

  const nameEntered = useMemo(
    () => context?.name && context.name.length > 0,
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
