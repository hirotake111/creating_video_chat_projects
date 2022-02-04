import { FormEventHandler, useRef } from "react";
import { Button, FormControl, TextField } from "@mui/material";

import { useSocketContext } from "./SocketContext";

export default function VideoController() {
  const ref = useRef<HTMLInputElement>(null);
  const context = useSocketContext();

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    callUser();
  };

  const callUser = () => {
    if (!ref.current?.value) {
      return console.log("empty ref");
    }

    if (ref.current.value.length < 4) {
      return console.log("ID to call is invalid");
    }

    console.log(ref.current.value);
    context?.callUser(ref.current.value);
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
        <Button color="primary" variant="outlined" onClick={callUser}>
          Call
        </Button>
      </FormControl>
    </form>
  );
}
