import { FormEventHandler, useRef } from "react";
import { Button, FormControl, TextField } from "@mui/material";

import { useSocketContext } from "./SocketContext";

export default function VideoController() {
  const ref = useRef<HTMLInputElement>(null);
  const context = useSocketContext();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          inputRef={ref}
          label="Enter ID to call"
          size="small"
          sx={{ paddingRight: "8px" }}
        />
        <Button color="primary" variant="outlined">
          Call
        </Button>
      </FormControl>
    </form>
  );
}
